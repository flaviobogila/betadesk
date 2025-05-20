import { Injectable } from '@nestjs/common';
import { BullMQService } from './bullmq.service';
import { MessageDispatcherService } from 'src/messages/message-dispatcher.service';
import { MessageService } from 'src/messages/message.service';
import { SendBaseMessageDto } from 'src/messages/dto/send-base-message.dto';
import { WhatsappService } from 'src/messages/whatsapp.service';
import { MessageType } from 'prisma/generated/prisma';
import { MetaExceptionFilter } from 'src/common/filters/meta-exception.filter';
import { TranslateMetaError } from 'src/common/utils/translate-meta-error.util';

@Injectable()
export class BullMQChatService {
  constructor(
    private readonly bullmq: BullMQService,
    private readonly messageService: MessageService,
    private readonly whatsappMessageDispatcher: MessageDispatcherService,
    private readonly whatsappService: WhatsappService) { }

  async handleOutcomingWhatsappMessage(chatId: string, message: SendBaseMessageDto) {
    await this.bullmq.addMessage(chatId, message);
    return this.bullmq.registerWorker(chatId, async (job) => {
      console.log(`Processando chat ${chatId}:`, job.data.message);

      try {
        const dispatchedMessage = await this.whatsappMessageDispatcher.dispatch(message.messageType, message);
        await this.messageService.updateMessageStatus(job.data.message.messageId, 'sent', { externalId: dispatchedMessage?.messages[0]?.id });
        console.log(`Processado chat ${chatId} com sucesso`);

      } catch (exception) {
        const metaError = exception?.response?.data?.error;
        const error = new TranslateMetaError().map(metaError) as any;

        await this.messageService.updateMessageStatus(job.data.message.messageId, 'failed', {
          metadata: {
            error
          }
        });
        console.error(`Processado chat ${chatId} com falha`, metaError);
        throw exception;
      }

    });
  }

  async handleDownloadWhatsappMessage(chatId: string, message: any) {
    if (![MessageType.image, MessageType.audio, MessageType.video, MessageType.document, MessageType.sticker].includes(message.messageType)) {
      return Promise.resolve();
    }
    await this.bullmq.addDownloadMessage(chatId, message);
    return this.bullmq.registerWorker(chatId, async (job) => {
      console.log(`Processando chat ${chatId}:`, job.data.message);
      await this.messageService.updateMediaStatus(job.data.message.id, 'downloading');

      try {
        const media = await this.whatsappService.downloadMediaFromMeta(job.data.message.mediaId!, job.data.message.channelId);
        if (media) {
          await this.messageService.updateMedia(job.data.message.id, media);
        } else {
          await this.messageService.updateMediaStatus(job.data.message.id, 'failed');
        }
      } catch (error) {
        await this.messageService.updateMediaStatus(job.data.message.id, 'failed');
        console.error(`Processado chat ${chatId} com falha`, error);
        throw error;
      }
    });
  }
}
