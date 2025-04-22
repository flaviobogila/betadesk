import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ChannelType {
  whatsapp = 'whatsapp',
  instagram = 'instagram',
  facebook = 'facebook',
  telegram = 'telegram',
}

export class CreateChannelDto {
  @ApiProperty({ example: 'uuid-do-tenant', description: 'ID do tenant proprietário do canal' })
  @IsString()
  tenantId: string;

  @ApiProperty({ example: 'Canal WhatsApp Principal' })
  @IsString()
  name: string;

  @ApiProperty({ enum: ChannelType, example: ChannelType.whatsapp })
  @IsEnum(ChannelType)
  type: ChannelType;

  @ApiProperty({ example: 'meta', description: 'Provedor da API (ex: meta, 360dialog)' })
  @IsString()
  provider: string;

  @ApiProperty({ example: '1234567890', description: 'Phone Number ID da Meta API' })
  @IsString()
  externalId: string;

  @ApiProperty({ example: 'EAAG...FZDZD', description: 'Token de acesso do canal' })
  @IsString()
  token: string;

  @ApiPropertyOptional({ description: 'Metadados adicionais (JSON)' })
  @IsOptional()
  metadata?: any;
}
