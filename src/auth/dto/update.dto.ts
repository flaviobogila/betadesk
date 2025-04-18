import { IsString, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from 'src/users/dto/create-user.dto';

export class UpdateDto {

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsUUID()
  tenantId: string;

  @IsEnum(UserRole)
  role: UserRole;
}