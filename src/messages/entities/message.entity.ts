import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
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
  @Expose({ groups: ['image','audio','video','document', 'sticker'] })
  mediaId?: string;

  @ApiProperty({ required: false })
  @Expose({ groups: ['image','audio','video','document', 'sticker'] })
  mediaUrl?: string;

  @ApiProperty({ required: false })
  @Expose({ groups: ['image','audio','video','document', 'sticker'] })
  mediaCaption?: string;

  @ApiProperty({ required: false })
  @Expose({ groups: ['image','audio','video','document', 'sticker'] })
  mediaMimeType?: string;

  @ApiProperty({ required: false })
  @Expose({ groups: ['image','audio','video','document', 'sticker'] })
  mediaSize?: number;

  @ApiProperty({ required: false })
  @Expose({ groups: ['audio','video'] })
  mediaDuration?: number;

  @ApiProperty({ required: false })
  @Expose({ groups: ['image','audio','video','document', 'sticker'] })
  mediaStatus?: MediaStatus;

  @ApiProperty({ required: false })
  @Expose({ groups: ['component'] })
  componentHeader?: string;

  @ApiProperty({ required: false })
  @Expose({ groups: ['component'] })
  componentFooter?: string;

  @ApiProperty({ required: false })
  @Expose({ groups: ['component'] })
  componentButtons?: any;

  @ApiProperty({ required: false })
  metadata?: any;

  @ApiProperty({ required: false })
  @Expose({ groups: ['reaction'] })
  reaction?: string;

  @ApiProperty()
  status: MessageStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  receivedAt: Date;
}
