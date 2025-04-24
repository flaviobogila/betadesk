import { PrismaService } from "src/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { WhatsAppChangeValue, WhatsAppMessage, WhatsAppMessageStatus } from "./dto/whatsapp-webhook.dto";
import { ChannelsService } from "src/channels/channels.service";
import { ContactsService } from "src/contacts/contacts.service";
import { ConversationsService } from "src/conversations/conversations.service";
import { MessageWhatsAppMapperService } from "./message-mapper.service";
import { Prisma } from "prisma/generated/prisma";
import { MessageService } from "src/messages/message.service";


@Injectable()
export class InboundMessageService {

  constructor(
    private readonly channelService: ChannelsService, 
    private readonly contactService: ContactsService,
    private readonly conversationService: ConversationsService,
    private readonly messageService: MessageService,
    private readonly messageMapper: MessageWhatsAppMapperService,
    
  ) { }

  async process({ change, message }: { change: WhatsAppChangeValue, message: WhatsAppMessage }) {
    const { phone_number_id } = change.metadata;
    const from = message.from;
    const name = message?.contacts?.[0]?.profile?.name
  
    let conversation = await this.conversationService.findOneActive(from, phone_number_id);
  
    if (!conversation) {
      const channel = await this.channelService.findByExternalId(phone_number_id);
      const contact = await this.contactService.findOrCreate(from, channel.tenantId, name);
      conversation = await this.conversationService.create(contact, channel, from);
    }
  
    const messageData: Partial<Prisma.MessageCreateInput> = this.messageMapper.map(message);

    await this.messageService.createMessage({
        ...messageData as any,
        conversationId: conversation.id,
      },
    )
  
    await this.conversationService.updateLastMessageDate(conversation.id, message.timestamp);
  }

  async updateStatus({ change, status }: { change: WhatsAppChangeValue, status: WhatsAppMessageStatus }) {
    const { phone_number_id } = change.metadata;
    const from = status.recipient_id;
  
    const conversation = await this.conversationService.findOneActive(from, phone_number_id);
    if (!conversation) {
      return;
    }
    await this.messageService.updateMessageStatus(status.id, status.status, {
      metadata: {
        timestamp: status.timestamp,
        conversation: status.conversation,
        pricing: status.pricing,
      }
    });
  }
  
}