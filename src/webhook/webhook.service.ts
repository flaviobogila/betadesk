import { Injectable, Logger } from '@nestjs/common';
import { WhatsAppChangeValue, WhatsAppEventTemplate, WhatsAppWebhookDto } from './dto/whatsapp-webhook.dto';
import { InboundMessageService } from './whatsapp/inbound-message.service';

@Injectable()
export class WebhookService {

  constructor(
    private readonly inboundMessageService: InboundMessageService) { }

  private readonly logger = new Logger(WebhookService.name);

  async handleWhatsAppWebhook(payload: WhatsAppWebhookDto) {
    this.logger.log('Recebendo webhook do WhatsApp...');
    const entries = payload?.entry ?? [];

    for (const entry of entries) {
      for (const change of entry?.changes ?? []) {
        
        if (change.field === 'messages') {
          const value = change.value as WhatsAppChangeValue;
          if(value?.messages?.length) {
            for (const message of value.messages) {
              this.logger.log(`Processando mensagem`, message);
              await this.inboundMessageService.process({ change: value, message });
              this.logger.log(`Mensagem processada`);
            }
          }

          if (value?.statuses?.length) {
            for (const statusMessage of value.statuses) {
              this.logger.log(`Processando mensagem de status`, statusMessage);
              await this.inboundMessageService.updateStatus(statusMessage);
              this.logger.log(`Mensagem de status processada`);
            }
          }
        }

        if (change.field === 'message_template_status_update') {
            const value = change.value as WhatsAppEventTemplate;
            this.logger.log(`Processando atualização de template`, value.event);
            await this.inboundMessageService.updateTemplateStatus(value);
            this.logger.log(`Mensagem de atualização de template processada`);
        }
      }
    }
  }

}
