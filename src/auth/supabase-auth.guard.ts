import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Request } from 'express';
  import { jwtVerify, createRemoteJWKSet } from 'jose';
  
  @Injectable()
  export class SupabaseAuthGuard implements CanActivate {
    private JWKS = createRemoteJWKSet(
      new URL('https://romicoijjlxebvivbwrb.supabase.co/auth/v1/keys')
    );
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<Request>() as any;
      const authHeader = request.headers['authorization'];
  
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Token não fornecido');
      }
  
      const token = authHeader.replace('Bearer ', '');
  
      try {
        const { payload } = await jwtVerify(token, this.JWKS, {
          issuer: 'https://romicoijjlxebvivbwrb.supabase.co/auth/v1',
        });
  
        // 🧠 Coloca os dados do usuário no request.user
        request.user = payload;
  
        return true;
      } catch (err) {
        console.error('Erro na verificação do token:', err);
        throw new UnauthorizedException('Token inválido');
      }
    }
  }
  