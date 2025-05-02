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
  
  @Injectable()
  export class SendMessageValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
      const dtoType = this.resolveDtoType(value.messageType);
  
      const instance = plainToInstance(dtoType, value) as any;
      const errors = validateSync(instance, { whitelist: true });
  
      if (errors.length > 0) {
        throw new BadRequestException(errors);
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
        case MessageType.button:
          return SendButtonMessageDto;
        case MessageType.list:
          return SendListButtonMessageDto;
        default:
          throw new BadRequestException(`messageType '${type}' não suportado.`);
      }
    }
  }
  