import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SendImageMessageDto {
  @IsString()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsString()
  @IsNotEmpty()
  channelId: string;
}
