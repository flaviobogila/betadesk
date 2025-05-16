import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID, Matches, MaxLength } from 'class-validator';

export class SignupDto {

  @ApiProperty({description: 'Endereço de e-mail (usuário)', example: 'usuario@example.com'})
  @IsEmail({},{message: 'O e-mail deve ser válido'})
  @IsNotEmpty({message: 'O e-mail é obrigatório'})
  email: string;

  @ApiProperty({description: 'Senha do usuário', example: 'senha123'})
  @IsString()
  @MaxLength(6, {message: 'A senha deve ter no máximo 6 caracteres'})
  password: string;

  @ApiProperty({description: 'Nome completo', example: 'João da Silva'})
  @IsString()
  @IsNotEmpty({message: 'O Nome é obrigatório'})
  @Matches(/^\S+\s+\S+.*$/, {
    message: 'Nome e sobrenome são obrigatórios.',
  })
  fullName: string;

  @ApiProperty({description: 'Nome da empresa', example: 'BetaDesk'})
  @IsString()
  @IsNotEmpty({message: 'O Nome da empresa é obrigatório'})
  companyName: string;

  @ApiProperty({description: 'Id da area do negócio (Ex.: Automotivo)', example: '123e4567-e89b-12d3-a456-426614174000'})
  @IsUUID(undefined, {message: 'A área do negócio inválida'})
  @IsNotEmpty({message: 'A área do negócio é obrigatória'})
  businessAreaId: string;
}