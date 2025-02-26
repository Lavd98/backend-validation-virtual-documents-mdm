import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { useContainer } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { corsConfig } from './config/cors.config';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  app.setGlobalPrefix('api');
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );
  
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  const stage = configService.get<string>('STAGE') || 'dev';
  const filesPath = stage === 'prod' 
    ? path.join(__dirname, '..', 'files')
    : path.join(process.cwd(), 'src', 'files');

    app.use('/files', express.static(filesPath, {
      maxAge: '1d',
      setHeaders: (res, filePath) => {
        if (path.extname(filePath) === '.pdf') {
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'inline');
        }
      }
    }));
  
  app.enableCors(corsConfig);
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}
bootstrap();
