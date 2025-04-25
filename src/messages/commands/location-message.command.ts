import { IMessageCommand } from '../interfaces/message-command.interface';
import { SendLocationMessageDto } from '../dto/send-location-message.dto';
import { WhatsappService } from '../whatsapp.service';

export class LocationMessageCommand implements IMessageCommand {
  constructor(private readonly whatsappService: WhatsappService) {}

  async execute(dto: SendLocationMessageDto) {
    return this.whatsappService.sendLocationMessage(dto);
  }
}