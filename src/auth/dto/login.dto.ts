import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({description: 'Endereço de e-mail (usuário)', example: 'usuario@example.com'})
  @IsEmail()
  email: string;

  @ApiProperty({description: 'Senha do usuário', example: 'senha123'})
  @IsString()
  password: string;
}
