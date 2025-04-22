import { IsString, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from 'src/common/enums/user-role.enum';

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