import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { SendBaseMessageDto } from './send-base-message.dto';

export class SendImageMessageDto extends SendBaseMessageDto {
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsOptional()
  @IsString()
  caption?: string;
}
