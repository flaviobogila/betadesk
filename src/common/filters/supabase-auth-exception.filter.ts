// src/auth/filters/supabase-auth-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationErrorException } from '../expections/validation.exception';

@Catch()
export class SupabaseAuthExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if(exception instanceof ValidationErrorException) {
        return response.status(exception.getStatus()).json({
            statusCode: exception.getStatus(), 
            message: exception.message,
            error: 'ValidationErrorException'
        });
    }

    const errorMessage = exception?.message?.toLowerCase() || '';
    const errorStatus = exception?.status || HttpStatus.BAD_REQUEST;

    const mapped = this.mapSupabaseError(errorMessage);

    if (mapped) {
      return response.status(mapped.status).json({
        statusCode: mapped.status,
        message: mapped.message,
        error: 'AuthErrorException'
      });
    }

    // fallback
    return response.status(errorStatus).json({
      statusCode: errorStatus,
      message: exception.message || 'Erro inesperado na autenticação.',
      error: 'AuthErrorException'
    });
  }

  private mapSupabaseError(message: string): {
    code: string;
    message: string;
    status: number;
  } | null {
    const map: { keyword: string; code: string; message: string; status: number }[] = [
      {
        keyword: 'has already been registered',
        code: 'EMAIL_JA_CADASTRADO',
        message: 'Este e-mail já está cadastrado.',
        status: HttpStatus.CONFLICT,
      },
      {
        keyword: 'signups not allowed',
        code: 'REGISTRO_DESATIVADO',
        message: 'Não é possível se registrar no momento.',
        status: HttpStatus.FORBIDDEN,
      },
      {
        keyword: 'invalid email',
        code: 'EMAIL_INVALIDO',
        message: 'O e-mail informado é inválido.',
        status: HttpStatus.BAD_REQUEST,
      },
      {
        keyword: 'password should be at least',
        code: 'SENHA_FRACA',
        message: 'A senha deve ter pelo menos 6 caracteres.',
        status: HttpStatus.BAD_REQUEST,
      },
      {
        keyword: 'email rate limit exceeded',
        code: 'LIMITE_EMAIL',
        message: 'Muitas tentativas com este e-mail. Tente novamente mais tarde.',
        status: HttpStatus.TOO_MANY_REQUESTS,
      },
      {
        keyword: 'bad request',
        code: 'REQUISICAO_INVALIDA',
        message: 'Dados inválidos. Verifique os campos e tente novamente.',
        status: HttpStatus.BAD_REQUEST,
      },
    ];

    for (const item of map) {
      if (message.includes(item.keyword)) {
        return {
          code: item.code,
          message: item.message,
          status: item.status,
        };
      }
    }

    return null;
  }
}
