import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SendBaseMessageDto } from './send-base-message.dto';

export class SendDocumentMessageDto extends SendBaseMessageDto{

  @ApiProperty()
  @IsString()
  documentUrl: string;

  @ApiProperty()
  @IsString()
  filename: string;

  @ApiProperty()
  @IsString()
  mimeType: string;
}
