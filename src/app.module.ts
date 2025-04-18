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
import { ChannelService } from './channels/channel.service';
import { ChannelsModule } from './channels/channels.module';

@Module({
  imports: [PrismaModule, UsersModule, TenantsModule, ChannelsModule],
  controllers: [AppController, UsersController, TenantsController, AuthController],
  providers: [AppService, UsersService, TenantsService, AuthService, WhatsappService, MessageFactoryService, ChannelService],
})
export class AppModule {}
