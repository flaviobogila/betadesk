import { IMessageCommand } from '../interfaces/message-command.interface';
import { SendDocumentMessageDto } from '../dto/send-document-message.dto';
import { WhatsappService } from '../whatsapp.service';

export class DocumentMessageCommand implements IMessageCommand {
  constructor(private readonly whatsappService: WhatsappService) {}

  async execute(dto: SendDocumentMessageDto) {
    return this.whatsappService.sendDocumentMessage(dto);
  }
}