import { IsString, IsArray, MaxLength, ValidateNested, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SendBaseMessageDto } from './send-base-message.dto';
import { Type } from 'class-transformer';

export class ButtonItem{
  @ApiProperty({ description: 'ID do botão', example: 'clique aqui' })
  @IsString()
  @MaxLength(20, { message: 'Os botões devem ter no máximo 20 caracteres.' })
  id: string;

  @ApiProperty({ description: 'Título do botão', example: 'Clique aqui' })
  @IsString()
  @MaxLength(20, { message: 'Os botões devem ter no máximo 20 caracteres.' })
  title: string;
}

export class SendButtonMessageDto extends SendBaseMessageDto {
  
  @ApiProperty({ description: 'Conteúdo da mensagem', example: 'Clique no botão abaixo' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Lista de botões', type: [ButtonItem] })
  @ValidateNested({ each: true, message: 'Cada botão deve ter id e title e ter no máximo 20 caracteres' })
  @Type(() => ButtonItem)
  @IsArray()
  @IsOptional()
  buttons: ButtonItem[]
}
