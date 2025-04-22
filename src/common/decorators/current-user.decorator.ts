import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SupabaseUser } from '../interfaces/supabase-user.interface';

export const CurrentUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): SupabaseUser => {
      const request = ctx.switchToHttp().getRequest();
      return {
        id: request.user.id,
        email: request.user.email,
        name: request.user.user_metadata.name,
        role: request.user.user_metadata.role,
        tenantId: request.user.user_metadata.tenant_id,
      }
    }
  );
  
