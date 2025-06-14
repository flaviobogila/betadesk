import { IsInt, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SendBaseMessageDto } from './send-base-message.dto';

export class SendDocumentMessageDto extends SendBaseMessageDto{

  @ApiProperty({ description: 'URL do documento', example: 'https://example.com/document.pdf' })
  @IsString()
  @IsUrl(undefined, { message: 'A Url deve ser válida' })
  documentUrl: string;

  @ApiProperty({ description: 'Título do documento', example: 'Relatório de vendas', required: false })
  @IsString()
  @IsOptional()
  caption?: string;

  @ApiProperty({ description: 'Tamanho do arquivo em bytes', example: 30000, required: false })
  @IsOptional()
  @IsInt()
  size?: number;

  @ApiProperty({ description: 'O Mime-Type que descreve o tipo de conteúdo do arquivo', example: 'application/pdf', required: false })
  @IsString()
  @IsOptional()
  mimeType?: string;

  @ApiProperty({ description: 'Nome do arquivo', example: 'arquivo.pdf', required: false })
  @IsOptional()
  @IsString()
  filename?: string;
}
