import { IsString, IsNotEmpty, ValidateNested, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SendBaseMessageDto } from './send-base-message.dto';

class ContactPhoneDto {
  @ApiProperty({ example: 'CELL' })
  @IsString()
  type: string;

  @ApiProperty({ example: '+5511999999999' })
  @IsString()
  phone: string;

  @ApiProperty({ example: '5511999999999' })
  @IsString()
  wa_id: string;
}

class ContactNameDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString()
  formatted_name: string;

  @ApiProperty({ example: 'João' })
  @IsString()
  first_name: string;

  @ApiProperty({ example: 'Silva' })
  @IsString()
  last_name: string;
}

class ContactOrgDto {
    @ApiProperty({ example: 'Meta' })
    @IsString()
    company?: string;
  
    @ApiProperty({ example: 'Sales' })
    @IsString()
    department?: string;
  
    @ApiProperty({ example: 'Manager' })
    @IsString()
    title?: string;
}

class ContactEmailDto {
    @ApiProperty({ example: 'exemplo@empresa.com' })
    @IsString()
    email?: string;
  
    @ApiProperty({ example: 'WORK|HOME' })
    @IsString()
    type?: string;
}

class ContactAddressDto {
    @ApiProperty({ example: 'Rua Luis III, 147' })
    @IsString()
    street?: string;
  
    @ApiProperty({ example: 'WORK|HOME' })
    @IsString()
    city?: string;

    @ApiProperty({ example: 'SP' })
    @IsString()
    state?: string;

    @ApiProperty({ example: '11111-999' })
    @IsString()
    zip?: string;

    @ApiProperty({ example: 'Brasil' })
    @IsString()
    country?: string;

    @ApiProperty({ example: '+55' })
    @IsString()
    country_code?: string;
}

class ContactUrlDto {
    @ApiProperty({ example: 'https://site.com' })
    @IsString()
    url?: string;
  
    @ApiProperty({ example: 'WORK|HOME' })
    @IsString()
    type?: string;
}


class SendContactDto {
  @ApiProperty({ type: ContactNameDto })
  @ValidateNested()
  @Type(() => ContactNameDto)
  @IsOptional()
  name: ContactNameDto;

  @ApiProperty({ type: [ContactPhoneDto] })
  @ValidateNested({ each: true })
  @Type(() => ContactPhoneDto)
  @IsOptional()
  phones: ContactPhoneDto[];

  @ApiProperty({ type: [ContactOrgDto] })
  @ValidateNested({ each: true })
  @Type(() => ContactOrgDto)
  @IsOptional()
  org?: ContactOrgDto;

  @ApiProperty({ type: [ContactEmailDto] })
  @ValidateNested({ each: true })
  @Type(() => ContactEmailDto)
  @IsOptional()
  emails?: ContactEmailDto[];

  @ApiProperty({ type: [ContactAddressDto] })
  @ValidateNested({ each: true })
  @Type(() => ContactAddressDto)
  @IsOptional()
  addresses?: ContactAddressDto[];

  @ApiProperty({ type: [ContactUrlDto] })
  @ValidateNested({ each: true })
  @Type(() => ContactUrlDto)
  @IsOptional()
  urls?: ContactUrlDto[];

  @ApiProperty({example: "28/09/1988"})
  @IsOptional()
  birthday?:string

}

export class SendContactMessageDto extends SendBaseMessageDto {
  @ApiProperty({ type: SendContactDto })
  @ValidateNested({ each: true })
  @Type(() => SendContactDto)
  contact: SendContactDto;
}
