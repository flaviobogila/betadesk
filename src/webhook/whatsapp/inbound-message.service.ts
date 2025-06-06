import { HttpException, Injectable } from "@nestjs/common";
import { ChannelsService } from "src/channels/channels.service";
import { ConversationsService } from "src/conversations/conversations.service";
import { MessageService } from "src/messages/message.service";
import { MessageWhatsAppMapperService } from "./message-mapper.service";
import { WhatsAppChangeValue, WhatsAppEventTemplate, WhatsAppMessage, WhatsAppMessageStatus } from "../dto/whatsapp-webhook.dto";
import { MessageEntity } from "src/messages/entities/message.entity";
import { MessageType } from "prisma/generated/prisma/client";
import { WhatsappService } from "src/messages/whatsapp.service";
import { BullMQChatService } from "src/messages/queues/bullmq/conversation.bullmq.service";
import { MessageTemplatesService } from "src/message-templates/message-templates.service";


@Injectable()
export class InboundMessageService {

  constructor(
    private readonly channelService: ChannelsService,
    private readonly conversationService: ConversationsService,
    private readonly messageService: MessageService,
    private readonly messageWhatsappMapper: MessageWhatsAppMapperService,
    private readonly whatsappService: WhatsappService,
    private readonly bullmqService: BullMQChatService,
    private readonly templatesService: MessageTemplatesService
  ) { }

  async process({ change, message }: { change: WhatsAppChangeValue, message: WhatsAppMessage }) {
    const { phone_number_id: externalChannelId } = change.metadata;
    const from = message.from;
    const name = change.contacts?.[0]?.profile?.name

    const channel = await this.channelService.findByExternalId(externalChannelId);
    if (!channel) {
      throw new HttpException(`Canal não encontrado para o id ${externalChannelId}`, 404);
    }

    const conversation = await this.conversationService.findOneActiveOrCreateByExternalChannelId({
      externalChannelId,
      clientPhone: from,
      clientName: name || '',
      origin: 'user'
    });

    if (!conversation) {
      throw new HttpException(`Não foi possível encontrar ou criar a conversa no canal: ${externalChannelId}`, 404);
    }

    //converte whatsapp message para o formato do sistema
    const messageData = this.messageWhatsappMapper.map(message) as any;
    //configura o id do contato e o nome do remetente
    const senderData = { senderId: conversation.contactId, senderName: name };
    //concatenando os dados da mensagem com os dados do remetente
    const messageReplyExternalId = message.context?.id;
    const messageCreateInput = { ...messageData, ...senderData };

    if (message.type === 'reaction') {
      await this.messageService.updateReaction(messageCreateInput);
    } else {
      const stored = await this.messageService.upsert(messageCreateInput, conversation.id, messageReplyExternalId);
      if (stored != null) {
        await this.conversationService.updateLastMessageDate(conversation.id, message.timestamp);
        //baixando media do whatsapp caso seja do tipo media
        //await this.downloadMedia(plainToInstance(MessageEntity, {...stored, channelId: conversation.channelId}));
        this.bullmqService.handleDownloadWhatsappMessage(conversation.id, { ...stored, channelId: conversation.channelId });
      }
    }
  }

  //TODO: refatorar para salvar em um storage na cloud
  async downloadMedia(message: MessageEntity) {
    const type = message.messageType as MessageType as any;
    if ([MessageType.image, MessageType.audio, MessageType.video, MessageType.document, MessageType.sticker].includes(type)) {
      //TODO: salvar media no storage
      const media = await this.whatsappService.downloadMediaFromMeta(message);
      if (media) {
        await this.messageService.updateMedia(message.id, media);
      }
    }
  }

  async updateStatus(status: WhatsAppMessageStatus) {
    const externalId = status.id;
    let error = status?.errors?.[0] ?? status.errors as any;
    if (error) {
      error = this.whatsappService.buildMetaError(status.errors?.[0]);
    }
    await this.messageService.updateMessageStatusByExternalId(externalId, status.status, {
      metadata: {
        error,
        timestamp: status.timestamp,
        conversation: status.conversation,
        pricing: status.pricing,
      }
    });
  }

  async updateTemplateStatus(eventTemplate: WhatsAppEventTemplate) {
    const { event, message_template_id, reason } = eventTemplate;
    const template = await this.templatesService.findByExternalId(message_template_id.toString());
    if (template) {
      const status = event.toLocaleLowerCase() as any;
      await this.templatesService.update(template.id, { status: status, reason});
    }
  }
}