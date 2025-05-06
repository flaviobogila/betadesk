import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { SendBaseMessageDto } from './send-base-message.dto';

export class SendTextMessageDto extends SendBaseMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
