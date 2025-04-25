import { Injectable, BadRequestException } from '@nestjs/common';
import { IMessageCommand } from '../interfaces/message-command.interface';
import { MessageType } from '@prisma/client';

@Injectable()
export class MessageCommandRegistry {
  private readonly commands = new Map<MessageType, IMessageCommand>();

  register(type: MessageType, command: IMessageCommand) {
    this.commands.set(type, command);
  }

  async execute(type: MessageType, dto: any): Promise<any> {
    const command = this.commands.get(type);
    if (!command) {
      throw new BadRequestException(`Tipo de mensagem '${type}' não suportado.`);
    }
    return command.execute(dto);
  }
}