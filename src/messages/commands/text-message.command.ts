import { SendTextMessageDto } from '../dto/send-text-message.dto';
import { IMessageCommand } from '../interfaces/message-command.interface';
import { WhatsappService } from '../whatsapp.service';

export class TextMessageCommand implements IMessageCommand {
  constructor(private readonly whatsappService: WhatsappService) {}

  async execute(dto: SendTextMessageDto) {
    return this.whatsappService.sendTextMessage(dto);
  }
}