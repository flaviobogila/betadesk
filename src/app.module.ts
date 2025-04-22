import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { TenantsController } from './tenants/tenants.controller';
import { TenantsModule } from './tenants/tenants.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { TenantsService } from './tenants/tenants.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { WhatsappService } from './messages/whatsapp.service';
import { MessageFactoryService } from './messages/message-factory.service';
import { ChannelsModule } from './channels/channels.module';
import { ChannelsService } from './channels/channels.service';
import { MessagesModule } from './messages/messages.module';
import { MessageService } from './messages/message.service';
import { WhatsappController } from './messages/whatsapp.controller';
import { WebhookService } from './webhook/webhook.service';
import { WhatsappWebhookController } from './webhook/whatsapp-webhook.controller';

@Module({
  imports: [PrismaModule, UsersModule, TenantsModule, ChannelsModule, MessagesModule],
  controllers: [AppController, UsersController, TenantsController, AuthController, WhatsappController, WhatsappWebhookController],
  providers: [AppService, UsersService, TenantsService, AuthService, WhatsappService, MessageFactoryService, ChannelsService, MessageService, WebhookService],
})
export class AppModule {}
