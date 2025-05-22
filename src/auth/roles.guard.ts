import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const allowedRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
  
      if (!allowedRoles || allowedRoles.length === 0) {
        return true; // se nenhuma role for exigida, libera
      }
  
      const request = context.switchToHttp().getRequest();
      const user = request.user;
  
      const userRole = user?.user_metadata?.role;
  
      if (!userRole || !allowedRoles.includes(userRole)) {
        throw new ForbiddenException('Você não tem permissão para acessar este recurso.');
      }
  
      return true;
    }
  }
  