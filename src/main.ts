import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { PrismaClientExceptionFilter } from './common/filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new PrismaClientExceptionFilter());


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false, //allow non-whitelisted property
      transform: true,
      exceptionFactory: (errors) => {
        const firstError = errors[0];
        const constraints = firstError?.constraints;
        const firstMessage = constraints ? Object.values(constraints)[0] : 'Erro de validação';
  
        return new BadRequestException(firstMessage);
      }
    })
  );

  const config = new DocumentBuilder()
    .setTitle('🐠 BetaDesk API')
    .setDescription('API RESTful para o sistema BetaDesk: plataforma SaaS de atendimento multicanal com automação inteligente e suporte humanizado.')
    .setVersion('1.0')
    .addTag('betadesk')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
