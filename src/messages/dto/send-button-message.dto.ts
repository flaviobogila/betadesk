import { IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SendBaseMessageDto } from './send-base-message.dto';

export class SendButtonMessageDto extends SendBaseMessageDto {
  
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ type: Array })
  @IsArray()
  buttons: Array<{
    id: string;
    title: string;
  }>;
}
