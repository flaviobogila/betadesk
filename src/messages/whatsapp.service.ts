import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import axios from 'axios';
import { SendTextMessageDto } from './dto/send-text-message.dto';
import { SendImageMessageDto } from './dto/send-image-message.dto';
import { SendTemplateMessageDto } from './dto/send-template-message.dto';
import { ChannelsService } from 'src/channels/channels.service';
import { SendAudioMessageDto } from './dto/send-audio-message.dto';
import { SendVideoMessageDto } from './dto/send-video-message.dto';
import { SendDocumentMessageDto } from './dto/send-document-message.dto';
import { SendStickerMessageDto } from './dto/send-sticker-message.dto';
import { SendLocationMessageDto } from './dto/send-location-message.dto';
import { SendButtonMessageDto } from './dto/send-button-message.dto';
import { SendComponentMessageDto } from './dto/send-component-message.dto';

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

  async sendAudioMessage(dto: SendAudioMessageDto) {
    const { to, audioUrl, channelId } = dto;
    const { externalId, token } = await this.getChannelAuth(channelId);
  
    return this.sendRequest(token, externalId, {
      messaging_product: 'whatsapp',
      to,
      type: 'audio',
      audio: {
        link: audioUrl,
      },
    });
  }

  async sendVideoMessage(dto: SendVideoMessageDto) {
    const { to, videoUrl, caption, channelId } = dto;
    const { externalId, token } = await this.getChannelAuth(channelId);
  
    return this.sendRequest(token, externalId, {
      messaging_product: 'whatsapp',
      to,
      type: 'video',
      video: {
        link: videoUrl,
        ...(caption ? { caption } : {}),
      },
    });
  }

  async sendDocumentMessage(dto: SendDocumentMessageDto) {
    const { to, documentUrl, filename, channelId } = dto;
    const { externalId, token } = await this.getChannelAuth(channelId);
  
    return this.sendRequest(token, externalId, {
      messaging_product: 'whatsapp',
      to,
      type: 'document',
      document: {
        link: documentUrl,
        filename,
      },
    });
  }
  
  async sendStickerMessage(dto: SendStickerMessageDto) {
    const { to, stickerUrl, channelId } = dto;
    const { externalId, token } = await this.getChannelAuth(channelId);
  
    return this.sendRequest(token, externalId, {
      messaging_product: 'whatsapp',
      to,
      type: 'sticker',
      sticker: {
        link: stickerUrl,
      },
    });
  }

  async sendLocationMessage(dto: SendLocationMessageDto) {
    const { to, latitude, longitude, name, address, channelId } = dto;
    const { externalId, token } = await this.getChannelAuth(channelId);
  
    return this.sendRequest(token, externalId, {
      messaging_product: 'whatsapp',
      to,
      type: 'location',
      location: {
        latitude,
        longitude,
        ...(name ? { name } : {}),
        ...(address ? { address } : {}),
      },
    });
  }

  async sendButtonMessage(dto: SendButtonMessageDto) {
    const { to, text, buttons, channelId } = dto;
    const { externalId, token } = await this.getChannelAuth(channelId);
  
    return this.sendRequest(token, externalId, {
      messaging_product: 'whatsapp',
      to,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: { text },
        action: {
          buttons: buttons.map((b) => ({
            type: b.type,
            reply: {
              id: b.payload,
              title: b.text,
            },
          })),
        },
      },
    });
  }
  
  async sendComponentMessage(dto: SendComponentMessageDto) {
    const { to, body, header, footer, buttons, channelId } = dto;
    const { externalId, token } = await this.getChannelAuth(channelId);
  
    return this.sendRequest(token, externalId, {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: 'custom_component_template', // pode ser genérico ou fixo
        language: { code: 'pt_BR' }, // pode ser parametrizado
        components: [
          ...(header ? [{ type: 'header', parameters: [{ type: 'text', text: header }] }] : []),
          { type: 'body', parameters: [{ type: 'text', text: body }] },
          ...(footer ? [{ type: 'footer', parameters: [{ type: 'text', text: footer }] }] : []),
          ...(buttons?.length
            ? [{
                type: 'button',
                sub_type: 'quick_reply',
                index: '0',
                parameters: buttons.map((b) => ({
                  type: 'payload',
                  payload: b.payload,
                })),
              }]
            : []),
        ],
      },
    });
  }

  async downloadMediaFromMeta(mediaId: string, token: string): Promise<Buffer> {
    try {
      // 1. Buscar a URL temporária da mídia
      const mediaMetaUrl = `https://graph.facebook.com/v19.0/${mediaId}`;
      const mediaMetaResponse = await axios.get(mediaMetaUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const mediaUrl = mediaMetaResponse.data?.url;
      if (!mediaUrl) {
        throw new HttpException('URL da mídia não encontrada.', HttpStatus.NOT_FOUND);
      }

      // 2. Fazer o download da mídia em si
      const mediaResponse = await axios.get(mediaUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'arraybuffer', // importante para binários
      });

      return Buffer.from(mediaResponse.data);
    } catch (error) {
      console.error('Erro ao baixar mídia:', error?.response?.data || error);
      throw new HttpException('Erro ao baixar mídia do WhatsApp.', HttpStatus.BAD_GATEWAY);
    }
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
