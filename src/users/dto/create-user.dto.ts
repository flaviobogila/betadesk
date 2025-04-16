// src/users/dto/create-user.dto.ts

import { IsEmail, IsEnum, IsOptional, IsString, IsUUID, IsBoolean } from 'class-validator';

export enum UserRole {
  admin = 'admin',
  manager = 'manager',
  agent = 'agent',
}

export class CreateUserDto {
  @IsUUID()
  tenantId: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}
