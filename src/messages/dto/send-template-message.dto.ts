import { IsString, IsNotEmpty, IsUUID, IsOptional, IsArray } from 'class-validator';
import { SendBaseMessageDto } from './send-base-message.dto';
import { PartialType, PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class TemplateComponentParameter {
  @IsString()
  @IsNotEmpty()
  type: 'text' | 'image' | 'video' | 'document';

  @IsString()
  @IsNotEmpty()
  text?: string;

  @IsString()
  @IsNotEmpty()
  image?: { link: string; };

  @IsString()
  @IsNotEmpty()
  video?:{ link: string; };

  @IsString()
  @IsNotEmpty()
  document?: { link: string; };
}

export class TemplateComponent {
  @IsString()
  @IsNotEmpty()
  type: 'body' | 'header' | 'footer' | 'button' | 'list';

  @IsArray()
  parameters?: TemplateComponentParameter[];
}

export class SendTemplateMessageDto extends SendBaseMessageDto {

  @ApiProperty({ description: 'Nome do template', example: 'boas_vindas' })
  @IsString()
  @IsNotEmpty({ message: 'Nome do template é obrigatório' })
  templateName: string;

  @ApiProperty({ description: 'Idioma do template', example: 'pt_BR' })
  @IsString()
  @IsNotEmpty({ message: 'Idioma do template é obrigatório' })
  language: 'pt_BR' | string; // Ex: 'pt_BR', 'en_US'

  @ApiProperty({ description: 'Componentes do template', example: '{"type": "body", "parameters": [ { "type": "text", "text": "João" }]}' })
  @IsArray()
  @IsOptional()
  components?: TemplateComponent[]
}
