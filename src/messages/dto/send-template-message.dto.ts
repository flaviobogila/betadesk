import { IsString, IsNotEmpty, IsOptional, IsArray, IsUUID } from 'class-validator';
import { SendBaseMessageDto } from './send-base-message.dto';
import { ApiProperty } from '@nestjs/swagger';

export class TemplateComponentParameter {
  @IsString()
  @IsNotEmpty()
  type: 'text' | 'image' | 'video' | 'document' | 'quick_reply' | 'url' | 'phone_number' | 'copy_code';

  @IsString()
  @IsOptional()
  text?: string;

  @IsString()
  @IsOptional()
  image?: { link: string; };

  @IsString()
  @IsOptional()
  video?:{ link: string; };

  @IsString()
  @IsOptional()
  document?: { link: string; };

  @IsString()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  phone_number?: string;

  @IsString()
  @IsOptional()
  copy_code?: string;

  @IsString()
  @IsOptional()
  example?: string;
}

export class TemplateComponent {
  @IsString()
  @IsNotEmpty()
  type: 'body' | 'header' | 'footer' | 'buttons';

  @IsArray()
  parameters?: TemplateComponentParameter[];
}

export class TemplateNamedParameter {
  [key: string]: string;
}

export class TemplateParameters{
  header?: TemplateNamedParameter;
  body?: TemplateNamedParameter;
  buttons?: string[];
}

export class SendTemplateMessageDto extends SendBaseMessageDto {

  @ApiProperty({ description: 'Id do template', example: 'uuid' })
  @IsString()
  @IsUUID()
  @IsNotEmpty({ message: 'Id do template é obrigatório' })
  templateId: string;

  @IsOptional()
  language?: string;

  @IsOptional()
  templateName?: string;

  @IsOptional()
  parameterFormat?: string;

  @ApiProperty({ description: 'Parametros do template', example: '{ header: {empresa: Flaware}, body: {nome: Flavio}, buttons: [cupom123]}' })
  @IsOptional()
  parameters?: TemplateParameters;

  @IsArray()
  @IsOptional()
  components?: {
    header?: any;
    body?: any;
    footer?: any;
    buttons?: any[];
  }
}
