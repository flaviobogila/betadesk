import { IsString, IsArray, IsOptional, ValidateNested, Max, MaxLength, ArrayMaxSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SendBaseMessageDto } from './send-base-message.dto';
import { Type } from 'class-transformer';

class ListRowDto {
  @ApiProperty({ description: 'Id do item', example: 'item 1' })
  @MaxLength(24, { message: 'O id do item deve ter no máximo 24 caracteres' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Title do item (visível para o usuário)', example: 'Título do item' })
  @MaxLength(24, { message: 'O título do item deve ter no máximo 24 caracteres' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Descrição do item', example: 'Descrição do item', required: false })
  @MaxLength(72, { message: 'A descrição do item deve ter no máximo 72 caracteres' })
  @IsOptional()
  @IsString()
  description?: string;
}

class ListSectionDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ type: [ListRowDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ListRowDto)
  rows: ListRowDto[];
}

export class SendListButtonMessageDto extends SendBaseMessageDto {
  
  @ApiProperty({ description: 'Conteúdo da mensagem', example: 'Selecione um de nossos serviços da lista para continuar seu atendimento' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Texto do botão', example: 'Ver serviços', default: 'Lista de opções' })
  @IsString()
  @MaxLength(20, { message: 'O texto do botão deve ter no máximo 20 caracteres' })
  buttonText: string;

  @ApiProperty({ description: 'Cabeçalho da mensagem', example: 'Nossos serviços', required: false })
  @IsOptional()
  @IsString()
  header?: string;

  @ApiProperty({ description: 'Rodapé da mensagem', example: 'digite /sair para deixar de receber mensagens', required: false })
  @IsOptional()
  @IsString()
  footer?: string;

  @ApiProperty({ description: 'Lista com itens (máx. 10)', type: [ListSectionDto] })
  @IsArray()
  @ArrayMaxSize(10, { message: 'A lista pode ter no máximo 10 itens.' })
  @ValidateNested({ each: true })
  @Type(() => ListRowDto)
  items: ListRowDto[];
}

