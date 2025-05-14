import { Injectable } from "@nestjs/common";
import { WhatsAppMessage } from "../dto/whatsapp-webhook.dto";
import { MessageStatus, MessageType, Prisma, SenderType } from "prisma/generated/prisma";

@Injectable()
export class MessageWhatsAppMapperService {

    map(msg: WhatsAppMessage): Partial<Prisma.MessageCreateInput> {

        const common = {
            messageType: msg.type as MessageType,
            externalId: msg.id,
            createdAt: new Date(Number(msg.timestamp) * 1000),
            status: MessageStatus.sent,
            senderType: SenderType.user,
        };

        switch (msg.type) {
            case 'text':
                return {
                    ...common,
                    content: msg.text!.body,
                };

            case 'image':
                return {
                    ...common,
                    mediaId: msg.image!.id, // OBS: precisa baixar com token, isso é só o ID
                    mediaMimeType: msg.image!.mime_type,
                    mediaCaption: msg.image!.caption
                };

            case 'audio':
                return {
                    ...common,
                    mediaId: msg.audio!.id,
                    mediaMimeType: msg.audio!.mime_type,
                };

            case 'video':
                return {
                    ...common,
                    mediaId: msg.video!.id,
                    mediaMimeType: msg.video!.mime_type,
                    mediaCaption: msg.video!.caption,
                };

            case 'document':
                return {
                    ...common,
                    mediaId: msg.document!.id,
                    mediaMimeType: msg.document!.mime_type,
                    metadata: {
                        filename: msg.document?.filename,
                    },
                };

            case 'sticker':
                return {
                    ...common,
                    mediaId: msg.sticker!.id,
                    mediaMimeType: msg.sticker!.mime_type,
                };

            case 'location':
                return {
                    ...common,
                    metadata: {
                        latitude: msg.location?.latitude,
                        longitude: msg.location?.longitude,
                        name: msg.location?.name,
                        address: msg.location?.address,
                    },
                };

            case 'button':
                return {
                    ...common,
                    content: msg.button!.text,
                    metadata: {
                        payload: msg.button?.payload,
                    },
                };

            case 'interactive':
                const reply = msg.interactive?.button_reply || msg.interactive?.list_reply;
                return {
                    ...common,
                    content: reply!.title,
                    metadata: {
                        reply_id: reply?.id,
                        type: msg.interactive?.type,
                    },
                };

            case 'reaction':
                return {
                    ...common,
                    metadata: {
                        emoji: msg.reaction?.emoji,
                        messageId: msg.reaction?.message_id,
                    },
                };

            default:
                return {
                    ...common,
                    messageType: MessageType.text,
                    content: '[Tipo de mensagem não mapeado]',
                    metadata: {
                        type: msg.type,
                        ...msg[msg.type]
                    }
                };
        }
    }
}