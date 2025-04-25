import { IMessageCommand } from '../interfaces/message-command.interface';
import { SendStickerMessageDto } from '../dto/send-sticker-message.dto';
import { WhatsappService } from '../whatsapp.service';

export class StickerMessageCommand implements IMessageCommand {
  constructor(private readonly whatsappService: WhatsappService) {}

  async execute(dto: SendStickerMessageDto) {
    return this.whatsappService.sendStickerMessage(dto);
  }
}