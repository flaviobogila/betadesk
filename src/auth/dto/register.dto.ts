import { IsEmail, IsString, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from 'src/common/enums/user-role.enum';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  fullName: string;

  @IsString()
  companyName: string;

  @IsOptional()
  @IsUUID()
  tenantId: string;
}