import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const TenantId = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): string => {
      const request = ctx.switchToHttp().getRequest();
      return request.user?.user_metadata?.tenant_id;
    }
  );
  