import { IsString, IsNotEmpty, IsUUID, IsOptional, IsArray } from 'class-validator';
import { SendBaseMessageDto } from './send-base-message.dto';

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

  @IsString()
  @IsNotEmpty()
  templateName: string;

  @IsString()
  @IsNotEmpty()
  languageCode: 'pt_BR'; // Ex: 'pt_BR', 'en_US'

  @IsArray()
  @IsOptional()
  components?: TemplateComponent[]
}
