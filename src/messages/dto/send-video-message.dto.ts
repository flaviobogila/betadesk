import { IsString, IsOptional, IsInt, maxLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SendBaseMessageDto } from './send-base-message.dto';

export class SendVideoMessageDto extends SendBaseMessageDto {

  @ApiProperty({ description: 'URL do vídeo', example: 'https://example.com/video.mp4' , required: true })
  @IsString()
  videoUrl: string;

  @ApiProperty({ description: 'Legenda do vídeo', example: 'Exemplo de leganda do vídeo' , required: false })
  @IsOptional()
  @IsString({ message: 'A legenda do vídeo deve ser um texto' })
  @MaxLength(2000, { message: 'A legenda do vídeo deve ter no máximo 1024 caracteres' })
  caption?: string;

  @ApiProperty({ description: 'O Mime-Type que descreve o tipo de conteúdo do arquivo', example: 'video/mp4', required: false })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiProperty({ description: 'Duração do vídeo em milisegundos', example: 1200, required: false })
  @IsOptional()
  @IsInt()
  duration?: number;
}
