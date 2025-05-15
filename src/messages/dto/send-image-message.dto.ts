import { IsString, IsNotEmpty, IsOptional, IsUrl, MaxLength } from 'class-validator';
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
}
