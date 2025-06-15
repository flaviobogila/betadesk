import { IsString, IsNotEmpty, IsOptional, IsUrl, MaxLength, IsInt } from 'class-validator';
import { SendBaseMessageDto } from './send-base-message.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SendImageMessageDto extends SendBaseMessageDto {
  @ApiProperty({ description: 'URL da imagem', example: 'https://example.com/image.jpg' })
  @IsUrl(undefined, { message: 'A URL da imagem deve ser válida.' })
  @IsNotEmpty({ message: 'A URL da imagem não pode ser vazia.' })
  imageUrl: string;

  @ApiProperty({ description: 'Legenda da imagem', example: 'Esta é uma imagem de exemplo.' })
  @IsOptional()
  @IsString({ message: 'A legenda da imagem deve ser um texto' })
  @MaxLength(2000, { message: 'A legenda da imagem deve ter no máximo 1024 caracteres' })
  caption?: string;

  @ApiProperty({ description: 'O Mime-Type que descreve o tipo de conteúdo do arquivo', example: 'video/mp4', required: false })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiProperty({ description: 'Tamanho do arquivo em bytes', example: 30000, required: false })
  @IsOptional()
  @IsInt()
  size?: number;
}
