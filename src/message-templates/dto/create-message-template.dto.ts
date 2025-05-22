import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TemplateCategory, TemplateStatus } from 'prisma/generated/prisma';

// COMPONENTES

export class ComponentHeader {
  @ApiProperty({
    description: 'Tipo do header: text, image, video, document',
    example: 'text',
  })
  @IsString({ message: 'O tipo do header deve ser uma string' })
  @IsNotEmpty({ message: 'O tipo do header é obrigatório' })
  type: string;

  @ApiProperty({
    description: 'Texto do header (se for do tipo text)',
    example: 'Olá, {{name}}',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'O texto do header deve ser uma string' })
  text?: string;

  @ApiProperty({
    description: 'URL da mídia (se for image, video ou document)',
    example: 'https://cdn.exemplo.com/media/header.jpg',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'A URL da mídia deve ser uma string' })
  mediaUrl?: string;
}

export class ComponentBody {
  @ApiProperty({
    description: 'Texto principal do corpo da mensagem, com parâmetros como {{1}}, {{name}}',
    example: 'Seu pedido {{1}} será entregue no dia {{2}}.',
  })
  @IsString({ message: 'O corpo do template deve ser uma string' })
  @IsNotEmpty({ message: 'O corpo do template é obrigatório' })
  text: string;
}

export class ComponentFooter {
  @ApiProperty({
    description: 'Texto do rodapé da mensagem',
    example: 'Equipe BetaDesk',
  })
  @IsString({ message: 'O rodapé do template deve ser uma string' })
  @IsNotEmpty({ message: 'O rodapé do template é obrigatório' })
  text: string;
}

export class ComponentButton {
  @ApiProperty({
    description: 'Tipo do botão (quick_reply ou call_to_action)',
    example: 'quick_reply',
  })
  @IsString({ message: 'O tipo do botão deve ser uma string' })
  type: string;

  @ApiProperty({
    description: 'Texto exibido no botão',
    example: 'Confirmar',
  })
  @IsString({ message: 'O texto do botão deve ser uma string' })
  text: string;
}

export class TemplateComponents {
  @ApiProperty({
    description: 'Header do template (opcional)',
    required: false,
    type: ComponentHeader,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ComponentHeader)
  header?: ComponentHeader;

  @ApiProperty({
    description: 'Corpo do template (obrigatório)',
    type: ComponentBody,
  })
  @ValidateNested()
  @Type(() => ComponentBody)
  body: ComponentBody;

  @ApiProperty({
    description: 'Rodapé do template (opcional)',
    required: false,
    type: ComponentFooter,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ComponentFooter)
  footer?: ComponentFooter;

  @ApiProperty({
    description: 'Botões interativos do template (opcional)',
    required: false,
    type: [ComponentButton],
  })
  @IsOptional()
  @IsArray({ message: 'Os botões devem estar em formato de lista' })
  @ValidateNested({ each: true })
  @Type(() => ComponentButton)
  buttons?: ComponentButton[];
}

// DTO PRINCIPAL

export class CreateMessageTemplateDto {
  @ApiProperty({
    description: 'ID do canal onde o template será vinculado',
    example: 'c8f02ad4-19fa-48f2-bab4-16c26f88c9b9',
  })
  @IsUUID('4', { message: 'O ID do canal deve ser válido' })
  @IsOptional()
  channelId: string;

  @ApiProperty({
    description: 'ID do usuário que está criando o template',
    example: '51dc48f3-7d78-4558-908a-e9e78c7ab2a4',
  })
  @IsUUID('4', { message: 'O ID do criador deve ser válido' })
  createdById: string;

  @ApiProperty({
    description: 'Nome técnico do template (usado na API da Meta)',
    example: 'order_confirmation',
  })
  @IsString({ message: 'O nome técnico deve ser uma string' })
  @IsNotEmpty({ message: 'O nome técnico é obrigatório' })
  name: string;

  @ApiProperty({
    description: 'Título visível para os usuários',
    example: 'Confirmação de Pedido',
  })
  @IsString({ message: 'O título do template deve ser uma string' })
  @IsNotEmpty({ message: 'O título do template é obrigatório' })
  title: string;

  @ApiProperty({
    enum: TemplateCategory,
    description: 'Categoria do template',
    example: TemplateCategory.TRANSACTIONAL,
  })
  @IsEnum(TemplateCategory, { message: 'Categoria inválida' })
  category: TemplateCategory;

  @ApiProperty({
    description: 'Idioma do template no padrão da Meta',
    example: 'pt_BR',
  })
  @IsString({ message: 'O idioma deve ser uma string' })
  @IsNotEmpty({ message: 'O idioma é obrigatório' })
  language: string;

  @ApiProperty({
    description: 'Componentes do template (header, body, footer, botões)',
    type: TemplateComponents,
  })
  @ValidateNested()
  @Type(() => TemplateComponents)
  components: TemplateComponents;

  @ApiProperty({
    description: 'Lista de parâmetros utilizados no template (opcional)',
    example: ['name', '1', '2'],
    required: false,
  })
  @IsObject({ message: 'Os parâmetros devem ser um objeto JSON' })
  @IsOptional()
  parameters?: Object;

  @ApiProperty({
    enum: TemplateStatus,
    description: 'Status inicial do template (opcional)',
    example: TemplateStatus.pending,
    required: false,
  })
  @IsOptional()
  @IsEnum(TemplateStatus, { message: 'Status inválido' })
  status?: TemplateStatus;

  @ApiProperty({
    description: 'Metadados adicionais (opcional)',
    example: {
      provedor: 'meta',
      namespace: 'abcd1234'
    },
    required: false,
  })
  @IsOptional()
  @IsObject({ message: 'Metadata deve ser um objeto JSON' })
  metadata?: Record<string, any>;
}
