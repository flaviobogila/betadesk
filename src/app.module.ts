import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { TenantsModule } from './tenants/tenants.module';
import { ChannelsModule } from './channels/channels.module';
import { MessagesModule } from './messages/messages.module';
import { ContactsModule } from './contacts/contacts.module';
import { ConversationsModule } from './conversations/conversations.module';
import { WebhookModule } from './webhook/webhook.module';
import { AuthModule } from './auth/auth.module';
import { LabelsModule } from './labels/labels.module';
import { ConversationLabelsModule } from './conversation-labels/conversation-labels.module';
import { TeamsModule } from './teams/teams.module';
import { TeamMembersModule } from './team-members/team-members.module';

@Module({
  imports: [PrismaModule, UsersModule, TenantsModule, ChannelsModule, MessagesModule, ContactsModule, ConversationsModule, WebhookModule, AuthModule, LabelsModule, ConversationLabelsModule, TeamsModule, TeamMembersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
