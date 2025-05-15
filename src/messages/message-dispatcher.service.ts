import { Injectable, OnModuleInit } from '@nestjs/common';
import { MessageCommandRegistry } from './registry/message-command.registry';
import { TextMessageCommand } from './commands/text-message.command';
import { WhatsappService } from './whatsapp.service';
import { ImageMessageCommand } from './commands/image-message.command';
import { AudioMessageCommand } from './commands/audio-message.command';
import { VideoMessageCommand } from './commands/video-message.command';
import { DocumentMessageCommand } from './commands/document-message.command';
import { StickerMessageCommand } from './commands/sticker-message.command';
import { LocationMessageCommand } from './commands/location-message.command';
import { ButtonMessageCommand } from './commands/button-message.command';
import { TemplateMessageCommand } from './commands/template-message.command';
import { ComponentMessageCommand } from './commands/component-message.command';
import { ButtonListMessageCommand } from './commands/button-list-message.command';
import { MessageType } from 'prisma/generated/prisma';
import { ContactMessageCommand } from './commands/contact-message.command';

@Injectable()
export class MessageDispatcherService implements OnModuleInit {
  constructor(
    private readonly registry: MessageCommandRegistry,
    private readonly whatsappService: WhatsappService,
  ) {}

  onModuleInit() {
    this.registry.register(MessageType.text, new TextMessageCommand(this.whatsappService));
    this.registry.register(MessageType.image, new ImageMessageCommand(this.whatsappService));
    this.registry.register(MessageType.audio, new AudioMessageCommand(this.whatsappService));
    this.registry.register(MessageType.video, new VideoMessageCommand(this.whatsappService));
    this.registry.register(MessageType.document, new DocumentMessageCommand(this.whatsappService));
    this.registry.register(MessageType.sticker, new StickerMessageCommand(this.whatsappService));
    this.registry.register(MessageType.location, new LocationMessageCommand(this.whatsappService));
    this.registry.register(MessageType.buttons, new ButtonMessageCommand(this.whatsappService));
    this.registry.register(MessageType.list, new ButtonListMessageCommand(this.whatsappService));
    this.registry.register(MessageType.template, new TemplateMessageCommand(this.whatsappService));
    this.registry.register(MessageType.component, new ComponentMessageCommand(this.whatsappService));
    this.registry.register(MessageType.contacts, new ContactMessageCommand(this.whatsappService));
  }

  async dispatch(type: MessageType, dto: any) {
    return this.registry.execute(type, dto);
  }
}
