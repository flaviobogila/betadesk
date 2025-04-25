import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Prisma } from '@prisma/client';
  import { Request, Response } from 'express';
  
  @Catch(Prisma.PrismaClientKnownRequestError)
  export class PrismaClientExceptionFilter implements ExceptionFilter {
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
  
      let status = HttpStatus.BAD_REQUEST;
      let message = 'Erro de banco de dados';
  
      switch (exception.code) {
        case 'P2002':
          message = `Registro duplicado. Campo único violado: ${exception.meta?.target}`;
          status = HttpStatus.CONFLICT;
          break;
        case 'P2025':
          message = 'Recurso relacionado não encontrado (provavelmente um connect falhou)';
          status = HttpStatus.NOT_FOUND;
          break;
        case 'P2003':
          message = 'Violação de chave estrangeira (referência inválida)';
          status = HttpStatus.BAD_REQUEST;
          break;
        // Adicione outros códigos conforme necessário
        default:
          message = `Erro Prisma: ${exception.code}`;
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          break;
      }
  
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
      });
    }
  }
  