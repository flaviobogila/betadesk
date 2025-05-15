// src/messages/pipes/send-message-validation.pipe.ts
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { MessageType } from '../dto/message-type.enum';
import { SendTextMessageDto } from '../dto/send-text-message.dto';
import { SendImageMessageDto } from '../dto/send-image-message.dto';
import { SendAudioMessageDto } from '../dto/send-audio-message.dto';
import { SendVideoMessageDto } from '../dto/send-video-message.dto';
import { SendDocumentMessageDto } from '../dto/send-document-message.dto';
import { SendLocationMessageDto } from '../dto/send-location-message.dto';
import { SendButtonMessageDto } from '../dto/send-button-message.dto';
import { SendListButtonMessageDto } from '../dto/send-list-button-message.dto';
import { SendContactMessageDto } from '../dto/send-contact-message.dto';
import { ValidationErrorException } from 'src/common/expections/validation.exception';
import { SendStickerMessageDto } from '../dto/send-sticker-message.dto';
import { SendTemplateMessageDto } from '../dto/send-template-message.dto';

@Injectable()
export class SendMessageValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const dtoType = this.resolveDtoType(value.messageType);

    const instance = plainToInstance(dtoType, value) as any;
    const errors = validateSync(instance, { whitelist: false });

    if (errors.length > 0) {
      const firstError = errors[0];
      const constraints = firstError?.constraints || firstError?.children?.[0]?.constraints || firstError?.children?.[0]?.children?.[0]?.constraints;
      const firstMessage = constraints ? Object.values(constraints)[0] : 'Erro de validação';

      throw new ValidationErrorException(firstMessage);
    }

    return instance;
  }

  private resolveDtoType(type: MessageType): any {
    switch (type) {
      case MessageType.text:
        return SendTextMessageDto;
      case MessageType.image:
        return SendImageMessageDto;
      case MessageType.audio:
        return SendAudioMessageDto;
      case MessageType.video:
        return SendVideoMessageDto;
      case MessageType.document:
        return SendDocumentMessageDto;
      case MessageType.location:
        return SendLocationMessageDto;
      case MessageType.buttons:
        return SendButtonMessageDto;
      case MessageType.list:
        return SendListButtonMessageDto;
      case MessageType.contacts:
        return SendContactMessageDto;
      case MessageType.sticker:
        return SendStickerMessageDto;
      case MessageType.template:
        return SendTemplateMessageDto;
      default:
        throw new BadRequestException(`messageType '${type}' não permitido.`);
    }
  }
}
