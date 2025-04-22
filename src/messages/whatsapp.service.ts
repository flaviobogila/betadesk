import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import axios from 'axios';
import { SendTextMessageDto } from './dto/send-text-message.dto';
import { SendImageMessageDto } from './dto/send-image-message.dto';
import { SendTemplateMessageDto } from './dto/send-template-message.dto';
import { ChannelsService } from 'src/channels/channels.service';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  constructor(private readonly channelService: ChannelsService) {}

  async sendTextMessage(dto: SendTextMessageDto) {
    const { to, content, channelId } = dto;
    const { externalId, token } = await this.getChannelAuth(channelId);

    return this.sendRequest(token, externalId, {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: content },
    });
  }

  async sendImageMessage(dto: SendImageMessageDto) {
    const { to, imageUrl, caption, channelId } = dto;
    const { externalId, token } = await this.getChannelAuth(channelId);

    return this.sendRequest(token, externalId, {
      messaging_product: 'whatsapp',
      to,
      type: 'image',
      image: {
        link: imageUrl,
        ...(caption ? { caption } : {}),
      },
    });
  }

  async sendTemplateMessage(dto: SendTemplateMessageDto) {
    const { to, templateName, languageCode, components, channelId } = dto;
    const { externalId, token } = await this.getChannelAuth(channelId);

    return this.sendRequest(token, externalId, {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: languageCode },
        components,
      },
    });
  }

  // 🔒 Recupera os dados de autenticação do canal
  private async getChannelAuth(channelId: string) {
    const channel = await this.channelService.getById(channelId);

    if (!channel || !channel.externalId || !channel.token) {
      throw new HttpException('Canal inválido ou mal configurado.', HttpStatus.BAD_REQUEST);
    }

    return {
      externalId: channel.externalId, // phone_number_id
      token: channel.token,
    };
  }

  //Envia a requisição para a API da Meta
  private async sendRequest(token: string, phoneNumberId: string, payload: any) {
    const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

    try {
      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      this.logger.error('Erro ao enviar mensagem', error?.response?.data || error.message);

      throw new HttpException(
        error?.response?.data || 'Erro ao enviar mensagem via WhatsApp',
        error?.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
