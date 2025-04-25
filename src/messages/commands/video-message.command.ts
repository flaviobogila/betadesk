import { IMessageCommand } from '../interfaces/message-command.interface';
import { SendVideoMessageDto } from '../dto/send-video-message.dto';
import { WhatsappService } from '../whatsapp.service';

export class VideoMessageCommand implements IMessageCommand {
  constructor(private readonly whatsappService: WhatsappService) {}

  async execute(dto: SendVideoMessageDto) {
    return this.whatsappService.sendVideoMessage(dto);
  }
}