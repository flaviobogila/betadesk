import { IMessageCommand } from '../interfaces/message-command.interface';
import { SendComponentMessageDto } from '../dto/send-component-message.dto';
import { WhatsappService } from '../whatsapp.service';

export class ComponentMessageCommand implements IMessageCommand {
  constructor(private readonly whatsappService: WhatsappService) {}

  async execute(dto: SendComponentMessageDto) {
    return this.whatsappService.sendComponentMessage(dto);
  }
}
