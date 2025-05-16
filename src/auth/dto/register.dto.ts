import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { SignupDto } from './signupDto';

export class RegisterDto extends SignupDto {

  @ApiProperty({description: 'Id do usuário', example: '123e4567-e89b-12d3-a456-426614174000', required: false})
  @IsUUID()
  @IsOptional()
  userId?: string;
}