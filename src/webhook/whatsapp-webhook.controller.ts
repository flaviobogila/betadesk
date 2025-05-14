import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('whatsapp/webhook')
export class WhatsappWebhookController {
  constructor(private readonly webhookService: WebhookService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  verifyWebhook(@Query('hub.mode') mode: string, @Query('hub.verify_token') verifyToken: string, @Query('hub.challenge') challenge: string) {
    const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN;

    if (mode === 'subscribe' && verifyToken === expectedToken) {
      return challenge;
    } else {
      return 'Unauthorized';
    }
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleIncomingMessage(@Body() payload: any) {
    await this.webhookService.handleWhatsAppWebhook(payload);
    return { success: true };
  }
}
