import { IMessageCommand } from '../interfaces/message-command.interface';
import { SendTemplateMessageDto } from '../dto/send-template-message.dto';
import { WhatsappService } from '../whatsapp.service';

export class TemplateMessageCommand implements IMessageCommand {
  constructor(private readonly whatsappService: WhatsappService) {}

  async execute(dto: SendTemplateMessageDto) {
    return this.whatsappService.sendTemplateMessage(dto);
  }
}