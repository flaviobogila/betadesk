import { IMessageCommand } from '../interfaces/message-command.interface';
import { SendVideoMessageDto } from '../dto/send-video-message.dto';
import { WhatsappService } from '../whatsapp.service';
import { SendContactMessageDto } from '../dto/send-contact-message.dto';

export class ContactMessageCommand implements IMessageCommand {
  constructor(private readonly whatsappService: WhatsappService) {}

  async execute(dto: SendContactMessageDto) {
    return this.whatsappService.sendContactMessage(dto);
  }
}