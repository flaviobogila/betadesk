import { IsString, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SendBaseMessageDto } from './send-base-message.dto';
import { Type } from 'class-transformer';

class ListRowDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

class ListSectionDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ type: [ListRowDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ListRowDto)
  rows: ListRowDto[];
}

export class SendListButtonMessageDto extends SendBaseMessageDto {
  
  @ApiProperty()
  @IsString()
  body: string;

  @ApiProperty()
  @IsString()
  buttonText: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  header?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  footer?: string;

  @ApiProperty({ type: [ListRowDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ListRowDto)
  items: ListRowDto[];
}

