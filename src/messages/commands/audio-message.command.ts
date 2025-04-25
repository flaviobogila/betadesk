import { IMessageCommand } from '../interfaces/message-command.interface';
import { SendAudioMessageDto } from '../dto/send-audio-message.dto';
import { WhatsappService } from '../whatsapp.service';

export class AudioMessageCommand implements IMessageCommand {
  constructor(private readonly whatsappService: WhatsappService) {}

  async execute(dto: SendAudioMessageDto) {
    return this.whatsappService.sendAudioMessage(dto);
  }
}