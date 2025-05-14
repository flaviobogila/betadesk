import { Injectable } from "@nestjs/common";
import { ChannelsService } from "src/channels/channels.service";
import { ContactsService } from "src/contacts/contacts.service";
import { ConversationsService } from "src/conversations/conversations.service";
import { MessageService } from "src/messages/message.service";
import { MessageWhatsAppMapperService } from "./message-mapper.service";
import { WhatsAppChangeValue, WhatsAppMessage, WhatsAppMessageStatus } from "../dto/whatsapp-webhook.dto";
import { MessageEntity } from "src/messages/entities/message.entity";
import { MessageType } from "prisma/generated/prisma/client";
import { WhatsappService } from "src/messages/whatsapp.service";
import { plainToInstance } from "class-transformer";


@Injectable()
export class InboundMessageService {

  constructor(
    private readonly channelService: ChannelsService, 
    private readonly contactService: ContactsService,
    private readonly conversationService: ConversationsService,
    private readonly messageService: MessageService,
    private readonly messageWhatsappMapper: MessageWhatsAppMapperService,
    private readonly whatsappService: WhatsappService,

  ) { }

  async process({ change, message }: { change: WhatsAppChangeValue, message: WhatsAppMessage }) {
    const { phone_number_id } = change.metadata;
    const from = message.from;
    const name = change.contacts?.[0]?.profile?.name
  
    let conversation = await this.conversationService.findOneActive(from, phone_number_id);
  
    if (!conversation) {
      const channel = await this.channelService.findByExternalId(phone_number_id);
      const contact = await this.contactService.findOrCreate(from, channel.tenantId, name);
      conversation = await this.conversationService.create(contact, channel);
    }
  
    //converte whatsapp message para o formato do sistema
    const messageData = this.messageWhatsappMapper.map(message) as any;
    //configura o id do contato e o nome do remetente
    const senderData = { senderId: conversation.contactId, senderName: name };
    //concatenando os dados da mensagem com os dados do remetente
    const replyTo = message.context?.id ?? undefined;
    const data = { ...messageData, ...senderData, replyTo };

    if(message.type === 'reaction') {
      await this.messageService.updateReaction(data);
    }else{
      const stored = await this.messageService.createIfNotExists(data, conversation.id, replyTo);
      if (stored != null) {
        await this.conversationService.updateLastMessageDate(conversation.id, message.timestamp);
        //baixando media do whatsapp caso seja do tipo media
        await this.downloadMedia(plainToInstance(MessageEntity, {...stored, channelId: conversation.channelId}));
      }
    }
  }

  //TODO: refatorar para salvar em um storage na cloud
  async downloadMedia(message: MessageEntity) {
    const type = message.messageType as MessageType as any;
    if ([MessageType.image, MessageType.audio, MessageType.video, MessageType.document].includes(type)) {
      const buffer = await this.whatsappService.downloadMediaFromMeta(message.channelId, message.mediaId!);
      return { buffer, mimeType: message.mediaMimeType, url: "https://www.google.com" };
    }
  }

  async updateStatus(status: WhatsAppMessageStatus) {
    // const { phone_number_id } = change.metadata;
    // const from = status.recipient_id;
    const externalId = status.id;
  
    // const conversation = await this.conversationService.findOneActive(from, phone_number_id);
    // if (!conversation) {
    //   return;
    // }
    
    await this.messageService.updateMessageStatusByExternalId(externalId, status.status, {
      metadata: {
        timestamp: status.timestamp,
        conversation: status.conversation,
        pricing: status.pricing,
      }
    });
  }
  
}