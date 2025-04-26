import { ApiProperty } from '@nestjs/swagger';
import { MessageType, SenderType, MessageStatus, MediaStatus } from 'prisma/generated/prisma/client';

export class MessageEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  conversationId: string;

  @ApiProperty({ required: false })
  channelId: string;

  @ApiProperty({ enum: SenderType })
  senderType: SenderType;

  @ApiProperty({ required: false })
  senderId?: string;

  @ApiProperty({ required: false })
  senderName?: string;

  @ApiProperty({ enum: MessageType })
  messageType: MessageType;

  @ApiProperty({ required: false })
  content?: string;

  @ApiProperty({ required: false })
  mediaId?: string;

  @ApiProperty({ required: false })
  mediaUrl?: string;

  @ApiProperty({ required: false })
  mediaCaption?: string;

  @ApiProperty({ required: false })
  mediaMimeType?: string;

  @ApiProperty({ required: false })
  mediaSize?: number;

  @ApiProperty({ required: false })
  mediaDuration?: number;

  @ApiProperty({ required: false })
  mediaStatus?: MediaStatus;

  @ApiProperty({ required: false })
  componentHeader?: string;

  @ApiProperty({ required: false })
  componentFooter?: string;

  @ApiProperty({ required: false })
  componentButtons?: any;

  @ApiProperty({ required: false })
  metadata?: any;

  @ApiProperty({ required: false })
  reaction?: string;

  @ApiProperty()
  status: MessageStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  receivedAt: Date;
}
