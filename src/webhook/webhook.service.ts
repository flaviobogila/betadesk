import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  async handleWhatsAppWebhook(payload: any) {
    this.logger.log('Recebendo webhook do WhatsApp...');

    try {
      const entry = payload?.entry?.[0];
      const change = entry?.changes?.[0]?.value;

      const phoneNumberId = change?.metadata?.phone_number_id;
      const messages = change?.messages;

      if (!phoneNumberId || !messages?.length) return;

      for (const message of messages) {
        // Aqui você chamaria:
        // - verificar canal (channel)
        // - criar ou encontrar contato
        // - criar ou encontrar conversa
        // - salvar a mensagem recebida
        this.logger.log(`Mensagem recebida: ${message.text?.body || '[não textual]'}`);
      }
    } catch (err) {
      this.logger.error('Erro ao processar webhook:', err);
    }
  }
}
