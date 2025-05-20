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

import * as FormData from 'form-data';
import { SendListButtonMessageDto } from './dto/send-list-button-message.dto';
import { SendContactMessageDto } from './dto/send-contact-message.dto';
import { WhatsAppMediaDownloadResponse } from 'src/webhook/dto/whatsapp-webhook.dto';
import { TranslateMetaError } from 'src/common/utils/translate-meta-error.util';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  constructor(private readonly channelService: ChannelsService) { }

  async sendTextMessage(dto: SendTextMessageDto) {
    const { to, content, replyTo, channelId } = dto;
    const { externalId, token } = await this.getChannelAuth(channelId);

    return this.sendRequest(token, externalId, {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: content },
      context: replyTo ? { message_id: replyTo } : undefined,
    });
  }

  async sendImageMessage(dto: SendImageMessageDto) {
    const { to, imageUrl, caption, replyTo, channelId } = dto;
    const { externalId, token } = await this.getChannelAuth(channelId);

    return this.sendRequest(token, externalId, {
      messaging_product: 'whatsapp',
      to,
      type: 'image',
      image: {
        link: imageUrl,
        ...(caption ? { caption } : {}),
      },
      context: replyTo ? { message_id: replyTo } : undefined,
    });
  }

  async sendTemplateMessage(dto: SendTemplateMessageDto) {
    const { to, templateName, language: languageCode, components, replyTo, channelId } = dto;
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
      context: replyTo ? { message_id: replyTo } : undefined,
    });
  }

  async sendAudioMessage(dto: SendAudioMessageDto) {
    const { to, audioUrl, replyTo, channelId } = dto;
    const { externalId, token } = await this.getChannelAuth(channelId);

    //const audioId = await this.getAudioId(audioUrl, channelId);

    return this.sendRequest(token, externalId, {
      messaging_product: 'whatsapp',
      to,
      type: 'audio',
      audio: {
        link: audioUrl,
      },
      context: replyTo ? { message_id: replyTo } : undefined,
    });
  }

  async sendVideoMessage(dto: SendVideoMessageDto) {
    const { to, videoUrl, caption, replyTo, channelId } = dto;
    const { externalId, token } = await this.getChannelAuth(channelId);

    return this.sendRequest(token, externalId, {
      messaging_product: 'whatsapp',
      to,
      type: 'video',
      video: {
        link: videoUrl,
        ...(caption ? { caption } : {}),
      },
      context: replyTo ? { message_id: replyTo } : undefined,
    });
  }

  async sendDocumentMessage(dto: SendDocumentMessageDto) {
    const { to, documentUrl, caption, replyTo, channelId } = dto;
    const { externalId, token } = await this.getChannelAuth(channelId);

    return this.sendRequest(token, externalId, {
      messaging_product: 'whatsapp',
      to,
      type: 'document',
      document: {
        link: documentUrl,
        caption,
      },
      context: replyTo ? { message_id: replyTo } : undefined,
    });
  }

  async sendStickerMessage(dto: SendStickerMessageDto) {
    const { to, stickerUrl, replyTo, channelId } = dto;
    const { externalId, token } = await this.getChannelAuth(channelId);

    return this.sendRequest(token, externalId, {
      messaging_product: 'whatsapp',
      to,
      type: 'sticker',
      sticker: {
        link: stickerUrl,
      },
      context: replyTo ? { message_id: replyTo } : undefined,
    });
  }

  async sendLocationMessage(dto: SendLocationMessageDto) {
    const { to, latitude, longitude, name, address, replyTo, channelId } = dto;
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
      context: replyTo ? { message_id: replyTo } : undefined,
    });
  }

  async sendButtonMessage(dto: SendButtonMessageDto) {
    const { to, content, buttons, replyTo, channelId } = dto;
    const { externalId, token } = await this.getChannelAuth(channelId);

    return this.sendRequest(token, externalId, {
      messaging_product: 'whatsapp',
      to,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: { text: content },
        action: {
          buttons: buttons.map((reply) => ({
            type: "reply",
            reply: {
              id: reply.id.substring(0, 20),
              title: reply.title.substring(0, 20)
            },
          })),
        },
      },
      context: replyTo ? { message_id: replyTo } : undefined,
    });
  }

  async sendListButtonMessage(dto: SendListButtonMessageDto) {
    const { to, content, buttonText, header, footer, items, replyTo, channelId } = dto;
    const { externalId, token } = await this.getChannelAuth(channelId);

    return this.sendRequest(token, externalId, {
      messaging_product: 'whatsapp',
      to,
      type: 'interactive',
      interactive: {
        type: 'list',
        header: header ? { type: 'text', text: header } : undefined,
        footer: footer ? { text: footer } : undefined,
        body: { text: content },
        action: {
          button: buttonText.substring(0, 20),
          sections: [
            {
              rows: items.map((item) => ({
                id: item.id,
                title: item.title,
                description: item.description,
              })),
            },
          ]
        }
      },
      context: replyTo ? { message_id: replyTo } : undefined,
    });
  }

  async sendComponentMessage(dto: SendComponentMessageDto) {
    const { to, body, header, footer, buttons, replyTo, channelId } = dto;
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
      context: replyTo ? { message_id: replyTo } : undefined,
    });
  }

  async sendContactMessage(dto: SendContactMessageDto) {
    const { to, contacts, replyTo, channelId } = dto;
    const { externalId, token } = await this.getChannelAuth(channelId);

    return this.sendRequest(token, externalId, {
      messaging_product: 'whatsapp',
      to,
      type: 'contacts',
      contacts,
      context: replyTo ? { message_id: replyTo } : undefined,
    });
  }

  buildMetaError(error: any) {
    const metaError = new TranslateMetaError().map(error)
    return {
      message: metaError?.message || 'Erro desconhecido',
      meta: metaError
    }
  }

  async getAudioId(audioUrl: string, channelId: string) {
    try {
      const { externalId, token } = await this.getChannelAuth(channelId);

      const responseAudio = await axios.get(audioUrl, {
        responseType: 'arraybuffer',
      });

      const buffer = Buffer.from(responseAudio.data);

      const form = new FormData();
      form.append('messaging_product', 'whatsapp');
      form.append('file', buffer, {
        contentType: 'audio/ogg; codecs=opus',
        filename: 'voice.ogg',
        knownLength: buffer.length
      });

      const response = await axios.post(
        `https://graph.facebook.com/v19.0/${externalId}/media`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            ...form.getHeaders()
          },
          maxBodyLength: Infinity // necessário para uploads grandes
        }
      );

      return response.data.id;
    } catch (error) {
      console.error('Erro ao baixar mídia:', error?.response?.data || error);
      throw new HttpException('Erro ao baixar mídia do WhatsApp.', HttpStatus.BAD_GATEWAY);
    }
  }

  async downloadMediaFromMeta(mediaId: string, channelId: string): Promise<WhatsAppMediaDownloadResponse> {
    try {
      const { externalId, token } = await this.getChannelAuth(channelId);

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
      // const mediaResponse = await axios.get(mediaUrl, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      //   responseType: 'arraybuffer', // importante para binários
      // });

      // return Buffer.from(mediaResponse.data);

      return mediaMetaResponse.data
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

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  }
}
