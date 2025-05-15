import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SendBaseMessageDto } from './send-base-message.dto';

export class SendLocationMessageDto extends SendBaseMessageDto {

  @ApiProperty({ description: 'Latitude', example: '37.7749' })
  @IsString()
  latitude: number;

  @ApiProperty({ description: 'Longitude', example: '-122.4194' })
  @IsString()
  longitude: number;

  @ApiProperty({ description: 'Nome do local', example: 'Padaria Real Sorocaba', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Endereço do local', example: 'Rua das Flores, 123, Sorocaba - SP', required: false })
  @IsOptional()
  @IsString()
  address?: string;
}
