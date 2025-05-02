import { IsString, IsArray, MaxLength, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SendBaseMessageDto } from './send-base-message.dto';
import { Type } from 'class-transformer';

export class ButtonItem{
  @ApiProperty()
  @IsString()
  @MaxLength(20, { message: 'O botão deve ter no máximo 20 caracteres.' })
  id: string;

  @ApiProperty()
  @IsString()
  @MaxLength(20, { message: 'O botão deve deve ter no máximo 20 caracteres.' })
  title: string;
}

export class SendButtonMessageDto extends SendBaseMessageDto {
  
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ type: Array })
  @ValidateNested({ each: true })
  @Type(() => ButtonItem)
  @IsArray()
  buttons: ButtonItem[]
}
