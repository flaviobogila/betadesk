import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SendBaseMessageDto } from './send-base-message.dto';

export class SendComponentMessageDto extends SendBaseMessageDto {

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  header?: string;

  @ApiProperty()
  @IsString()
  body: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  footer?: string;

  @ApiProperty({ type: Array })
  @IsArray()
  buttons: any[]; // Pode ser tipado com mais detalhe se necessário
}
