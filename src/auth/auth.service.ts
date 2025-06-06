import { HttpException, Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  async registerUser(dto: RegisterDto) {
    const { email, password, fullName } = dto;

    const { data, error } = await this.supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        name: fullName,
        tenant_id: 'anonymous',
        role: "admin",
      },
      email_confirm: true,
    });

    if (error) {
      throw new HttpException(error.message, error.status || 400);
    }

    return data;
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(`Erro ao fazer login: ${error.message}`);
    }

    return data; // Contém session e user
  }

  async updateMetadata(userId: string, tenantId: string, role: string) {
    
    const { data, error } = await this.supabase.auth.admin.updateUserById(userId, {
        user_metadata: {
          tenant_id: tenantId,
          role: role
        }
      });

      if (error) {
        throw new Error(`Erro ao atualizar login: ${error.message}`);
      }
      return data;
  }

  async getUser(accessToken: string) {
    const { data, error } = await this.supabase.auth.getUser(accessToken);

    if (error) {
      throw new Error(`Erro ao obter usuário: ${error.message}`);
    }

    return data.user;
  }

  async delete(id: string) {
    const { data, error } = await this.supabase.auth.admin.deleteUser(id);

    if (error) {
      throw new Error(`Erro ao deletar usuário: ${error.message}`);
    }

    return data.user;
  }

}
