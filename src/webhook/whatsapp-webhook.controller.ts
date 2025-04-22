import {
    Controller,
    Get,
    Post,
    Query,
    Body,
    Headers,
    HttpCode,
    HttpStatus,
  } from '@nestjs/common';
import { WebhookService } from './webhook.service';
  
  @Controller('webhook/whatsapp')
  export class WhatsappWebhookController {
    constructor(private readonly webhookService: WebhookService) {}
  
    // ✅ GET para verificação do webhook (usado no setup da Meta)
    @Get()
    @HttpCode(HttpStatus.OK)
    verifyWebhook(
      @Query('hub.mode') mode: string,
      @Query('hub.verify_token') verifyToken: string,
      @Query('hub.challenge') challenge: string,
    ) {
      const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN;
  
      if (mode === 'subscribe' && verifyToken === expectedToken) {
        return challenge;
      } else {
        return 'Unauthorized';
      }
    }
  
    // ✅ POST para receber mensagens reais da Meta
    @Post()
    @HttpCode(HttpStatus.OK)
    async handleIncomingMessage(@Body() payload: any, @Headers() headers: any) {
      // Aqui você pode adicionar validação de assinatura (X-Hub-Signature)
      await this.webhookService.handleWhatsAppWebhook(payload);
      return { success: true };
    }
  }
  