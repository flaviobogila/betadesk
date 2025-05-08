// src/messages/dto/send-message-base.dto.ts
import { IsUUID, IsEnum, IsNotEmpty, IsOptional, ValidateIf, IsString, IsUrl, IsObject, IsArray, ValidateNested, isNotEmpty, IsBoolean } from 'class-validator';
import { MessageType } from './message-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { SendContactMessageDto } from './send-contact-message.dto';
import { Type } from 'class-transformer';
import { ButtonItem } from './send-button-message.dto';

export class SendMessageBaseDto {
  @ApiProperty({ example: '296d5f0c-ad78-4d31-9dfd-c996aa074857' })
  @IsUUID(undefined, { message: 'channelId precisa ser um UUID válido.' })
  channelId: string;

  @ApiProperty({ example: '296d5f0c-ad78-4d31-9dfd-c996aa074857' })
  @IsNotEmpty({ message: 'conversationId não pode estar vazio.' })
  @IsUUID(undefined, { message: 'conversationId precisa ser um UUID válido.' })
  conversationId: string;

  @ApiProperty({ enum: MessageType })
  @IsEnum(MessageType, { message: 'messageType deve ser um tipo válido (text, image, template, etc).' })
  messageType: MessageType;

  @ApiProperty({example: '5515999998888'})
  @IsNotEmpty({ message: 'to não pode estar vazio.' })
  to: string;

  @ApiProperty({example: 'oi, tudo bem?'})
  @ValidateIf((o) => o.messageType === MessageType.text || o.messageType === MessageType.button || o.messageType === MessageType.list)
  @IsNotEmpty({ message: 'O campo content não pode estar vazio para mensagens de texto.' })
  content?: string;

  @ApiProperty()
  @ValidateIf((o) => o.messageType === MessageType.text)
  @IsBoolean({ message: 'O campo isPrivate deve ser um booleano.' })
  isPrivate?: string;

  @ApiProperty()
  @ValidateIf((o) => o.messageType === MessageType.text)
  @IsUUID(undefined, { message: 'O campo mentionedUserId deve ser um uuid.' })
  mentionedUserId?: string;

  @ApiProperty({example: 'https://example.com/image.jpg'})
  @ValidateIf((o) => o.messageType === MessageType.image)
  @IsNotEmpty({ message: 'O campo imageUrl é obrigatório para mensagens de mídia.' })
  @IsUrl({}, { message: 'imageUrl deve ser uma URL válida.' })
  imageUrl?: string;

  @ApiProperty({example: 'https://example.com/video.mp4'})
  @ValidateIf((o) => o.messageType === MessageType.video)
  @IsNotEmpty({ message: 'O campo videoUrl é obrigatório para mensagens de mídia.' })
  @IsUrl({}, { message: 'videoUrl deve ser uma URL válida.' })
  videoUrl?: string;

  @ApiProperty({example: 'https://example.com/file.pdf'})
  @ValidateIf((o) => o.messageType === MessageType.document)
  @IsNotEmpty({ message: 'O campo documentUrl é obrigatório para mensagens de mídia.' })
  @IsUrl({}, { message: 'documentUrl deve ser uma URL válida.' })
  documentUrl?: string;

  @ApiProperty({example: 'https://example.com/audio.ogg'})
  @ValidateIf((o) => o.messageType === MessageType.audio)
  @IsNotEmpty({ message: 'O campo audioUrl é obrigatório para mensagens de mídia.' })
  @IsUrl({}, { message: 'audioUrl deve ser uma URL válida.' })
  audioUrl?: string;

  @ApiProperty({example: '-47.505516055205376'})
  @ValidateIf((o) => o.messageType === MessageType.location)
  @IsNotEmpty({ message: 'O campo latitude é obrigatório para mensagens de localização.' })
  latitude?: string;

  @ApiProperty({example: '-47.505516055205376'})
  @ValidateIf((o) => o.messageType === MessageType.location)
  @IsNotEmpty({ message: 'O campo longitude é obrigatório para mensagens de localização.' })
  longitude?: string;

  @ApiProperty({example: 'Meta'})
  @ValidateIf((o) => o.messageType === MessageType.location)
  name?: string;

  @ApiProperty({example: 'Rua Exemplo, 123, Bairro Exemplo, Cidade Exemplo, Estado Exemplo'})
  @ValidateIf((o) => o.messageType === MessageType.location)
  address?: string;

  @ApiProperty({example: 'essa é uma imagem de exemplo'})
  @ValidateIf((o) => o.messageType === MessageType.image)
  @IsString({ message: 'caption deve ser uma string.' })
  @IsOptional()
  caption?: string;

  @ApiProperty({example: [{id: '1', title: 'Botão 1'}, {id: '2', title: 'Botão 2'}]})
  @ValidateIf((o) => o.messageType === MessageType.button)
  @IsArray({ message: 'O campo buttons precisa ser uma lista de botões' })
  buttons?: [{ id: string; title: string }];

  @ApiProperty({example: 'Lista de Opções'})
  @ValidateIf((o) => o.messageType === MessageType.list)
  @IsString()
  buttonText: string;

  @ApiProperty({example: 'Exemplo de Cabeçalho'})
  @ValidateIf((o) => o.messageType === MessageType.list)
  @IsOptional()
  @IsString()
  header?: string;

  @ApiProperty({example: 'Exemplo de Rodapé'})
  @ValidateIf((o) => o.messageType === MessageType.list)
  @IsOptional()
  @IsString()
  footer?: string;

  @ApiProperty({example: [{id: '1', title: 'Opção 1'}, {id: '2', title: 'Opção 2'}]})
  @ValidateIf((o) => o.messageType === MessageType.list)
  @IsArray()
  items: [{ id: string; title: string; description?: string }];

  @ApiProperty({example: { contact: {}}})
  @ValidateIf((o) => o.messageType === MessageType.contact)
  contact: SendContactMessageDto;

  @ApiProperty({example: "pt_BR"})
  @IsNotEmpty({ message: 'languageCode não pode estar vazio.' })
  @ValidateIf((o) => o.messageType === MessageType.template)
  languageCode: string;

  @ApiProperty({example: "nomedotemplate"})
  @IsNotEmpty({ message: 'templateName não pode estar vazio.' })
  @ValidateIf((o) => o.messageType === MessageType.template)
  templateName: string;

  @ApiProperty({example: []})
  @IsNotEmpty({ message: 'components não pode estar vazio.' })
  @ValidateIf((o) => o.messageType === MessageType.template)
  components: [];

  @ApiProperty({example: '296d5f0c-ad78-4d31-9dfd-c996aa074857'})
  @IsString({ message: 'replyTo deve ser um UUID da mensagem a ser respondida.' })
  @IsUUID()
  @IsOptional()
  replyTo?: string;
}

