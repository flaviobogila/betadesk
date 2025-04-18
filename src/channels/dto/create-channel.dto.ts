import { IsString, IsEnum, IsOptional } from 'class-validator';

export enum ChannelType {
  whatsapp = 'whatsapp',
  instagram = 'instagram',
  facebook = 'facebook',
  telegram = 'telegram',
}

export class CreateChannelDto {
  @IsString()
  name: string;

  @IsEnum(ChannelType)
  type: ChannelType;

  @IsString()
  provider: string; // Ex: meta, 360dialog

  @IsString()
  externalId: string; // phone_number_id

  @IsString()
  token: string;

  @IsOptional()
  metadata?: any;
}
