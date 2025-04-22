import { IsString, IsNotEmpty, IsUUID, IsOptional, IsArray } from 'class-validator';

export class TemplateComponentParameter {
  @IsString()
  @IsNotEmpty()
  type: 'text';

  @IsString()
  @IsNotEmpty()
  text: string;
}

export class TemplateComponent {
  @IsString()
  @IsNotEmpty()
  type: 'body';

  @IsArray()
  parameters: TemplateComponentParameter[];
}

export class SendTemplateMessageDto {
  @IsUUID()
  channelId: string;

  @IsUUID()
  conversationId: string;

  @IsString()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  templateName: string;

  @IsString()
  @IsNotEmpty()
  languageCode: 'pt_BR'; // Ex: 'pt_BR', 'en_US'

  @IsArray()
  components: TemplateComponent[];
}
