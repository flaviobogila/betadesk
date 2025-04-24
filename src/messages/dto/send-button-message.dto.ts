import { IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SendBaseMessageDto } from './send-base-message.dto';

export class SendButtonMessageDto extends SendBaseMessageDto {
  
  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty({ type: Array })
  @IsArray()
  buttons: Array<{
    type: string;
    text: string;
    payload: string;
  }>;
}
