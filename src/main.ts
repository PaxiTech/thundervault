import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '@src/app.module';
import { AppExceptionFilter } from '@src/common/exceptions/app-exception.filter';
import { TransformInterceptor } from '@src/common/interceptors/transform.interceptor';
import { AppLogger } from '@src/common/services/app-logger.service';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as mongoose from 'mongoose';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.useStaticAssets(join(__dirname, '..', 'asset'), {
    index: false,
    prefix: '/asset',
  });
  mongoose.set('debug', true);
  const logger = app.get(AppLogger);
  app.useLogger(logger);
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });
  app.useGlobalFilters(new AppExceptionFilter(logger));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());

  const configSwagger = new DocumentBuilder()
    .setTitle('Paxi presale')
    .setDescription('The Paxi presale API ')
    .setVersion('1.0')
    .addServer(process.env.SWAGGER_API_URL || 'http://localhost:5000')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT || 5000);
}
bootstrap();
