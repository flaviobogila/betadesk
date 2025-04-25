import { IMessageCommand } from '../interfaces/message-command.interface';
import { SendButtonMessageDto } from '../dto/send-button-message.dto';
import { WhatsappService } from '../whatsapp.service';

export class ButtonMessageCommand implements IMessageCommand {
  constructor(private readonly whatsappService: WhatsappService) {}

  async execute(dto: SendButtonMessageDto) {
    return this.whatsappService.sendButtonMessage(dto);
  }
}
