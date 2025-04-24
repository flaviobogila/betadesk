import { Module } from '@nestjs/common';
import { WhatsappWebhookController } from './whatsapp-webhook.controller';
import { WebhookService } from './webhook.service';
import { MessageWhatsAppMapperService } from './message-mapper.service';
import { InboundMessageService } from './inbound-message.service';
import { MessageFactoryService } from 'src/messages/message-factory.service';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { ChannelsModule } from 'src/channels/channels.module';
import { ContactsModule } from 'src/contacts/contacts.module';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
    imports: [ContactsModule, ConversationsModule, ChannelsModule, MessagesModule],
    controllers: [WhatsappWebhookController],
    providers: [WebhookService, MessageWhatsAppMapperService, InboundMessageService, MessageFactoryService],
    exports: [],
})
export class WebhookModule {}
