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
            senderType: SenderType.user
        };

        const { context } = msg;

        switch (msg.type) {
            case 'text':
                return {
                    ...common,
                    content: msg.text!.body,
                    metadata: {
                        context
                    }
                };

            case 'image':
                return {
                    ...common,
                    mediaId: msg.image!.id, // OBS: precisa baixar com token, isso é só o ID
                    mediaMimeType: msg.image!.mime_type,
                    mediaCaption: msg.image!.caption,
                    metadata: {
                        context
                    }
                };

            case 'audio':
                return {
                    ...common,
                    mediaId: msg.audio!.id,
                    mediaMimeType: msg.audio!.mime_type,
                    metadata: {
                        context
                    }
                };

            case 'video':
                return {
                    ...common,
                    mediaId: msg.video!.id,
                    mediaMimeType: msg.video!.mime_type,
                    mediaCaption: msg.video!.caption,
                    metadata: {
                        context
                    }
                };

            case 'document':
                return {
                    ...common,
                    mediaId: msg.document!.id,
                    mediaMimeType: msg.document!.mime_type,
                    metadata: {
                        filename: msg.document?.filename,
                        context
                    },
                };

            case 'sticker':
                return {
                    ...common,
                    mediaId: msg.sticker!.id,
                    mediaMimeType: msg.sticker!.mime_type,
                    metadata: {
                        context
                    }
                };

            case 'location':
                return {
                    ...common,
                    metadata: {
                        location:{ 
                            latitude: msg.location?.latitude,
                            longitude: msg.location?.longitude,
                            name: msg.location?.name,
                            address: msg.location?.address,
                        },
                        context
                    },
                };

            case 'button':
                return {
                    ...common,
                    content: msg.button!.text,
                    metadata: {
                        button: {
                            id: msg.button?.payload,
                            title: msg.button?.text
                        },
                        context
                    },
                };

            case 'interactive':
                const reply = msg.interactive?.button_reply || msg.interactive?.list_reply;
                return {
                    ...common,
                    content: reply!.title,
                    metadata: {
                        button: {
                            id: reply?.id,
                            title: reply?.title,
                            type: msg.interactive?.type,
                        },
                        context
                    },
                };

            case 'reaction':
                return {
                    ...common,
                    metadata: {
                        emoji: msg.reaction?.emoji,
                        messageId: msg.reaction?.message_id,
                        context
                    },
                };
            
            case 'contacts':
                const contact = msg.contacts![0];
                return {
                    ...common,
                    metadata: {
                        contact,
                        context
                    },
                };

            default:
                return {
                    ...common,
                    messageType: MessageType.text,
                    content: '[Tipo de mensagem não suportada]',
                    metadata: {
                        context,
                        type: msg.type,
                        ...msg[msg.type as any],
                        errors: msg.errors
                    }
                };
        }
    }
}