import { SendImageMessageDto } from '../dto/send-image-message.dto';
import { IMessageCommand } from '../interfaces/message-command.interface';
import { WhatsappService } from '../whatsapp.service';

export class ImageMessageCommand implements IMessageCommand {
  constructor(private readonly whatsappService: WhatsappService) {}

  async execute(dto: SendImageMessageDto) {
    return this.whatsappService.sendImageMessage(dto);
  }
}