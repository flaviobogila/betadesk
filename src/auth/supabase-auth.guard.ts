import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ Use apenas no backend!
  );

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de autenticação ausente');
    }

    const token = authHeader.replace('Bearer ', '').trim();

    const {
      data: { user },
      error,
    } = await this.supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    // 🧠 Injeta os dados do usuário no request para uso posterior
    req['user'] = user;

    return true;
  }
}
