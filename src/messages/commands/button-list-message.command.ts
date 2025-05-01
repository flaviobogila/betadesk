import { IMessageCommand } from '../interfaces/message-command.interface';
import { WhatsappService } from '../whatsapp.service';
import { SendListButtonMessageDto } from '../dto/send-list-button-message.dto';

export class ButtonListMessageCommand implements IMessageCommand {
  constructor(private readonly whatsappService: WhatsappService) {}

  async execute(dto: SendListButtonMessageDto) {
    return this.whatsappService.sendListButtonMessage(dto);
  }
}
