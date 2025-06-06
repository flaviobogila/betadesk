import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { PrismaClientExceptionFilter } from './common/filters/prisma-exception.filter';
import { ValidationErrorException } from './common/expections/validation.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new PrismaClientExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove campos que não estão no DTO
      forbidNonWhitelisted: false, // lança erro se campos não estiverem no DTO
      transform: true, // transforma para instância de classe
      exceptionFactory: (errors) => {
        const firstError = errors[0];
        const constraints = firstError?.constraints;
        const firstMessage = constraints ? Object.values(constraints)[0] : 'Erro de validação';
  
        return new ValidationErrorException(firstMessage);
      }
    })
  );

  const config = new DocumentBuilder()
    .setTitle('🐠 BetaDesk API')
    .setDescription('API RESTful para o sistema BetaDesk: plataforma SaaS de atendimento multicanal com automação inteligente e suporte humanizado.')
    .setVersion('1.0')
    .addTag('betadesk')
    .addBearerAuth(  // ⬅️ Adiciona o esquema de autenticação
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Insira o token do supabase auth no campo abaixo',
      },
      'access-token', // nome que você usará para referenciar essa auth
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors();

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
