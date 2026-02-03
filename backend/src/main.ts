import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const uploadsPath = join(process.cwd(), 'uploads');
  console.log('--- CMS BACKEND STARTUP ---');
  console.log('CWD:', process.cwd());
  console.log('Uploads Path:', uploadsPath);
  try {
    console.log('Uploads Files:', require('fs').readdirSync(uploadsPath));
  } catch (e: any) {
    console.error('Failed to read uploads:', e.message);
  }
  console.log('---------------------------');

  app.enableCors();

  app.use('/uploads', (req: any, res: any, next: any) => {
    const filename = req.url.startsWith('/') ? req.url.substring(1) : req.url;
    const targetPath = join(uploadsPath, filename);
    console.log(`[DEBUG] GET /uploads${req.url} -> ${targetPath} (Exists: ${require('fs').existsSync(targetPath)})`);
    next();
  }, express.static(uploadsPath));

  const designsPath = join(process.cwd(), 'designs');
  app.use('/designs', express.static(designsPath));

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
