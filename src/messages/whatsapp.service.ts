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
import { CreateMessageTemplateDto } from 'src/message-templates/dto/create-message-template.dto';

import { extension as lookupMime } from 'mime-types'; // converte "image/jpeg" → "jpeg"
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabase: SupabaseClient = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
    const { to, replyTo, channelId } = dto;
    const { externalId, token } = await this.getChannelAuth(channelId);

    return this.sendRequest(token, externalId, {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: this.buildSendTemplate(dto),
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
        filename: dto.filename || undefined
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

  async createTemplate(templateDto: CreateMessageTemplateDto) {
    // try {
    const { channelId } = templateDto;
    const { wabaId, token } = await this.getChannelAuth(channelId);

    const templateData = this.buildCreateTemplate(templateDto);

    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${wabaId}/message_templates`,
      templateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
    // } catch (error) {
    //   this.logger.error('Erro ao criar template:', error?.response?.data || error);
    //   throw new HttpException(this.buildMetaError(error), HttpStatus.BAD_REQUEST);
    // }
  }

  private buildSendTemplate(template: SendTemplateMessageDto) {
    const components = [] as any;

    if (template.parameters?.header) {
      const componentsHeader = {
        type: 'header',
        parameters: [] as any[]
      }
      const { type } = template?.components?.header?.type || 'text';
      if (type === "text") {
        if (template.parameters?.header) {
          if (template.parameterFormat === 'NAMED') {
            componentsHeader.parameters = Object.entries(template.parameters?.header).map(([key, value]) => ({
              parameter_name: key,
              type: "text",
              text: value
            }))
          } else {
            componentsHeader.parameters = Object.entries(template.parameters?.header).map(([key, value]) => ({
              type: "text",
              text: value
            }))
          }
        }
      } else if (["image", "video", "document"].includes(type)) {
        // precisa existir um ID de exemplo de mídia para a criação do template
        componentsHeader.parameters = [{
          type,
          [type]: {
            link: template.parameters?.header.url
          }
        }]
      }

      components.push(componentsHeader);
    }

    if (template.parameters?.body) {
      const componentBody: any = {
        type: "body",
        parameters: []
      }

      if (template.parameterFormat === 'NAMED') {

        componentBody.parameters = Object.entries(template.parameters?.body).map(([key, value]) => ({
          parameter_name: key,
          type: "text",
          text: value
        }))

      } else {
        componentBody.parameters = Object.entries(template.parameters?.body).map(([, value]) => ({
          type: "text",
          text: value
        }))
      }

      components.push(componentBody);
    }

    if (template.parameters?.buttons) {

      const componentButtons = template?.components?.buttons?.map((button: any, index: number) => {

        if (button.type === 'url' && button.example) {
          return {
            type: 'button',
            sub_type: 'url',
            index: index.toString(),
            paramenters: [{
              type: 'text',
              text: button.substring(0, 25)
            }]
          };
        }
        if (button.type === 'copy_code' && button.example) {
          return {
            type: 'button',
            sub_type: 'copy_code',
            index: "0",
            paramenters: [{
              type: 'text',
              text: button.substring(0, 15)
            }]
          };
        }
      })

      components.push(componentButtons);
    }

    return {
      name: template.templateName,
      language: { code: template.language || 'pt_BR' }, // padrão pt_BR
      components
    };
  }


  private buildCreateTemplate(template: CreateMessageTemplateDto) {
    const components = [] as any;

    if (template.components?.header) {
      const headerType = template.components.header.type?.toUpperCase();

      const headerComponent: any = {
        type: "HEADER",
        format: headerType
      };

      if (headerType === "TEXT") {
        headerComponent.text = template.components.header.text;
        if (template.components?.header?.example) {
          if (template.parameterFormat === 'NAMED') {
            headerComponent.example = {
              header_text_named_params: Object.entries(template.components?.header?.example).map(([key, value]) => ({
                param_name: key,
                example: value
              }))
            };
          } else {
            headerComponent.example = {
              header_text: Object.values(template.components?.header?.example) // deve conter text(s)
            };
          }
        }
      } else if (["IMAGE", "VIDEO", "DOCUMENT"].includes(headerType)) {
        // precisa existir um ID de exemplo de mídia para a criação do template
        headerComponent.example = {
          header_handle: [template?.components?.header?.mediaId] // deve conter media-id(s)
        };
      }

      components.push(headerComponent);
    }

    if (template.components?.body?.text) {
      const componentBody: any = {
        type: "BODY",
        text: template.components.body.text
      }

      if (template.components?.body?.example) {
        if (template.parameterFormat === 'NAMED') {

          componentBody.example = {
            body_text_named_params: Object.entries(template.components?.body?.example).map(([key, value]) => ({
              param_name: key,
              example: value
            }))
          };

        } else {
          componentBody.example = {
            body_handle: Object.values(template.components.body.example)
          };
        }
      }

      components.push(componentBody);
    }

    if (template.parameters?.footer) {
      components.push({
        type: "FOOTER",
        text: template.components?.footer?.text || ''
      });
    }

    if (template.components?.buttons?.length) {
      components.push({
        type: "BUTTONS",
        buttons: template.components.buttons.map((btn: any) => {
          if (btn.type === 'quick_reply') {
            return {
              type: 'QUICK_REPLY',
              text: btn.text.substring(0, 25)
            };
          }
          if (btn.type === 'phone_number') {
            return {
              type: 'PHONE_NUMBER',
              text: btn.text.substring(0, 25),
              phone_number: btn.phone_number
            };
          }
          if (btn.type === 'url') {
            return {
              type: 'URL',
              url: btn.url,
              text: btn.text.substring(0, 25),
              example: [btn.example]
            };
          }
          if (btn.type === 'copy_code') {
            return {
              type: 'COPY_CODE',
              text: btn.text.substring(0, 15),
              example: [btn.example]
            };
          }
          if (btn.type === 'catalog' || btn.type === 'mpm' || btn.type === 'spm') {
            return {
              type: btn.type.toUpperCase(),
              text: btn.text.substring(0, 25),
            };
          }
        })
      });
    }

    return {
      name: template.name,
      language: template.language,
      category: template.category,
      parameter_format: template.parameterFormat,
      components
    };
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

  /**
   * Faz o download de uma mídia do WhatsApp (via Meta Graph API) e salva no Supabase Storage.
   * @param mediaId   ID da mídia fornecido pelo WhatsApp (Meta).
   * @param channelId ID da conversa (usado para criar pasta em "conversations/<channelId>").
   * @returns         Um objeto contendo a URL pública, o caminho no bucket e o tipo MIME.
   */
  async downloadMediaFromMeta(
    message: any
  ): Promise<Pick<WhatsAppMediaDownloadResponse, 'id' | 'url' | 'mime_type' | 'file_size'>> {
    try {
      const { id: messageId, mediaId, channelId, conversationId } = message;
      // 1. Obter token e externalId do canal (função existente)
      const { externalId, token } = await this.getChannelAuth(channelId);

      // 2. Buscar a URL temporária da mídia
      const mediaMetaUrl = `https://graph.facebook.com/v19.0/${mediaId}`;
      const mediaMetaResponse = await axios.get(mediaMetaUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const mediaUrl: string | undefined = mediaMetaResponse.data?.url;
      const mimeType: string | undefined = mediaMetaResponse.data?.mime_type;

      if (!mediaUrl || !mimeType) {
        throw new HttpException(
          'URL da mídia ou tipo MIME não encontrados.',
          HttpStatus.NOT_FOUND
        );
      }

      // 3. Fazer o download da mídia (binário)
      const mediaResponse = await axios.get<ArrayBuffer>(mediaUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'arraybuffer',
      });

      // Converter ArrayBuffer em Buffer do Node.js
      const mediaBuffer = Buffer.from(mediaResponse.data);

      // 4. Determinar extensão de arquivo a partir do tipo MIME
      //    Exemplo: "image/jpeg" → "jpeg"
      const ext = lookupMime(mimeType) || 'beta';

      // 5. Montar nome de arquivo e caminho dentro da bucket
      //    Aqui usamos <mediaId>.<ext>, mas você pode adaptar se quiser usar outro padrão.
      const fileName = `${messageId}.${ext}`;
      const storagePath = `${channelId}/${conversationId}/${fileName}`; // ex.: "12345abc/image12345.jpeg"

      // 6. Fazer o upload para o Supabase Storage na bucket "conversations"
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('conversations')
        .upload(storagePath, mediaBuffer, {
          contentType: mimeType,
          upsert: true, // sobrescreve se já existir (opcional)
        });

      if (uploadError) {
        console.error('Erro ao fazer upload no Supabase:', uploadError);
        throw new HttpException(
          'Falha ao salvar mídia no storage.',
          HttpStatus.BAD_GATEWAY
        );
      }

      // 7. Obter a URL pública (public URL) do arquivo
      const {data} = supabase.storage
        .from('conversations')
        .getPublicUrl(storagePath);

      const {publicUrl} = data;

      if ( !publicUrl) {
        console.error('Erro ao obter publicURL:', publicUrl);
        throw new HttpException(
          'Mídia salva, mas não foi possível obter URL pública.',
          HttpStatus.BAD_GATEWAY
        );
      }

      // 8. Retornar objeto contendo informações relevantes
      return {
        id: mediaId, // ID original da mídia
        url: publicUrl,  
        mime_type: mimeType,
        file_size: mediaBuffer.length,
      };
    } catch (error: any) {
      console.error(
        'Erro ao baixar/enviar mídia:',
        error?.response?.data || error
      );
      throw new HttpException(
        'Erro ao baixar ou salvar mídia do WhatsApp.',
        HttpStatus.BAD_GATEWAY
      );
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
      wabaId: channel?.metadata?.['wabaId'], // waba_id
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
