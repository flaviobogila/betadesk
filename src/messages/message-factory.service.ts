import { Injectable, BadRequestException } from '@nestjs/common';
import { MessageType } from './dto/message-type.enum';
import { SendImageMessageDto } from './dto/send-image-message.dto';
import { SendTemplateMessageDto } from './dto/send-template-message.dto';
import { SendTextMessageDto } from './dto/send-text-message.dto';
import { WhatsappService } from './whatsapp.service';

@Injectable()
export class MessageFactoryService {
  constructor(private readonly whatsappService: WhatsappService) {}

  async send(messageType: MessageType, dto: any) {
    switch (messageType) {
      case MessageType.text:
        return this.whatsappService.sendTextMessage(dto as SendTextMessageDto);

      case MessageType.image:
        return this.whatsappService.sendImageMessage(dto as SendImageMessageDto);

      case MessageType.template:
        return this.whatsappService.sendTemplateMessage(dto as SendTemplateMessageDto);

      default:
        throw new BadRequestException(`Tipo de mensagem '${messageType}' não suportado.`);
    }
  }
}
