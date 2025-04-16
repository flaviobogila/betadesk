import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
