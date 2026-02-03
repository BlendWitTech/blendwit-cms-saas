import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const uploadsPath = join(process.cwd(), 'uploads');
  try {
    if (!require('fs').existsSync(uploadsPath)) {
      require('fs').mkdirSync(uploadsPath, { recursive: true });
    }
  } catch (e: any) {
    console.error('Failed to prepare uploads directory:', e.message);
  }

  app.enableCors();

  app.use('/uploads', (req: any, res: any, next: any) => {
    next();
  }, express.static(uploadsPath));

  const designsPath = join(process.cwd(), 'designs');
  app.use('/designs', express.static(designsPath));

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
