// src/bullmq/bullmq.service.ts
import { Injectable } from '@nestjs/common';
import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';

@Injectable()
export class BullMQService {
    private connection = new Redis(process.env.UPSTASH_REDIS_URL!,{
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
    });
    private queues = new Map<string, Queue>();

    getQueue(chatId: string): Queue {
        if (!this.queues.has(chatId)) {
            const queue = new Queue(`chat.${chatId}`, { connection: this.connection });
            this.queues.set(chatId, queue);
        }
        return this.queues.get(chatId)!;
    }

    async addMessage(chatId: string, message: any) {
        const queue = this.getQueue(chatId);
        await queue.add('message', { message }, {
            removeOnComplete: true,
            removeOnFail: true,
        });
    }

    async addDownloadMessage(chatId: string, message: any) {
        const queue = this.getQueue(chatId);
        await queue.add('download', { message }, {
            removeOnComplete: true,
            removeOnFail: true,
        });
    }

    async registerWorker(chatId: string, handler: (job: Job) => Promise<void>) {
        const worker = new Worker(`chat.${chatId}`, handler, {
            connection: this.connection,
            concurrency: 1,
        });

        worker.on('drained', async () => {
            await worker.close();
        });
    }
}
