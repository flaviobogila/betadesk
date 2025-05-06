import { HttpException, Injectable, Logger } from '@nestjs/common';
import { WhatsAppWebhookDto } from './dto/whatsapp-webhook.dto';
import { HttpStatusCode } from 'axios';
import { InboundMessageService } from './whatsapp/inbound-message.service';

@Injectable()
export class WebhookService {

  constructor(
    private readonly inboundMessageService: InboundMessageService) {  }

  private readonly logger = new Logger(WebhookService.name);

  async handleWhatsAppWebhook(payload: WhatsAppWebhookDto) {
    this.logger.log('Recebendo webhook do WhatsApp...');

    try {

      const entries = payload?.entry ?? [];

      for (const entry of entries) {
        for (const change of entry?.changes ?? []) {
          const value = change.value;

          if (value?.messages?.length) {
            for (const message of value.messages) {
              this.logger.log(`Processando mensagem`, message);
              await this.inboundMessageService.process({ change:value, message });
              this.logger.log(`Mensagem processada`);
            }
          }

          if (value?.statuses?.length) {
            for (const status of value.statuses) {
              this.logger.log(`Processando mensagem de status`, status);
              await this.inboundMessageService.updateStatus({ change:value, status });
              this.logger.log(`Mensagem de status processada`);
            }
          }
        }
      }
    } catch (err) {
      this.logger.error('Erro ao processar webhook:', err);
      throw new HttpException("Houve um erro ao processar a mensagem", HttpStatusCode.InternalServerError);
    }
  }

}
