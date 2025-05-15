import { IsString, IsNotEmpty, ValidateNested, IsArray, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SendBaseMessageDto } from './send-base-message.dto';

class ContactPhoneDto {
  @ApiProperty({ description: 'Categoria', example: 'WORK|HOME', required: false })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ description: 'Número de telefone', example: '+5511999999999' })
  @IsString()
  @IsNotEmpty({ message: 'O número de telefone é obrigatório' })
  phone: string;

  @ApiProperty({ description: 'Id do whatsapp', example: '5511999999999', required: false })
  @IsString()
  @IsOptional()
  wa_id?: string;
}

class ContactNameDto {
  @ApiProperty({ description: 'Nome completo', example: 'João Silva', required: false })
  @IsString()
  @IsOptional()
  formatted_name?: string;

  @ApiProperty({ description: 'Primeiro nome', example: 'João', required: false })
  @IsString()
  @IsOptional()
  first_name?: string;

  @ApiProperty({ description: 'Último nome ou sobrenome', example: 'da Silva', required: false })
  @IsString()
  @IsOptional()
  last_name?: string;
}

class ContactOrgDto {
    @ApiProperty({ description: 'Nome da empresa', example: 'Meta', required: false })
    @IsString()
    @IsOptional()
    company?: string;
  
    @ApiProperty({ description: 'Nome do departamento', example: 'Sales', required: false })
    @IsString()
    @IsOptional()
    department?: string;
  
    @ApiProperty({ description: 'Cargo', example: 'Manager', required: false })
    @IsString()
    @IsOptional()
    title?: string;
}

class ContactEmailDto {
    @ApiProperty({ description: 'Endereço de e-mail', example: 'exemplo@empresa.com' })
    @IsString()
    @IsEmail({}, { message: 'O e-mail deve ser válido' })
    email?: string;
  
    @ApiProperty({ description: 'Categoria do email', example: 'WORK|HOME', required: false })
    @IsString()
    @IsOptional()
    type?: string;
}

class ContactAddressDto {
    @ApiProperty({ description: 'Rua (Logradouro)', example: 'Rua Luis III, 147', required: false  })
    @IsString()
    @IsOptional()
    street?: string;
  
    @ApiProperty({ description: 'Cidade', example: 'Sorocaba', required: false  })
    @IsString()
    @IsOptional()
    city?: string;

    @ApiProperty({ description: 'Estado', example: 'São Paulo', required: false  })
    @IsString()
    @IsOptional()
    state?: string;

    @ApiProperty({ description: 'CEP', example: '18110-000', required: false  })
    @IsString()
    @IsOptional()
    zip?: string;

    @ApiProperty({ description: 'País', example: 'Brasil', required: false  })
    @IsString()
    @IsOptional()
    country?: string;

    @ApiProperty({ description: 'Código do país', example: '+55', required: false  })
    @IsString()
    @IsOptional()
    country_code?: string;
}

class ContactUrlDto {
    @ApiProperty({ description: 'Site', example: 'https://www.empresa.com.br', required: false  })
    @IsString()
    @IsOptional()
    url?: string;
  
    @ApiProperty({ description: 'Categoria do site', example: 'WORK|HOME', required: false  })
    @IsString()
    @IsOptional()
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
  contacts: SendContactDto[];
}
