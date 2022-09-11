import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { urlencoded, json } from 'express';
import * as bodyParser from 'body-parser';
import { join } from 'path';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // swagger ui configurations.
  app.setGlobalPrefix('api/v1');
  const options = new DocumentBuilder()
  .setTitle('Employee Salary Management API')
  .setDescription('The Employee Salary Management API description')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
  // global validation pipe.
  app.useGlobalPipes(new ValidationPipe());

  app.use(bodyParser.json({
    verify: (req, res, buf) => {
        req['rawBody'] = buf
    },
    limit: '50mb'
}));
app.use(json({ limit: '50mb' }));
app.use(urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// enable cors.
app.enableCors();

// app.useStaticAssets(join(__dirname, '..', 'public'));
// app.setBaseViewsDir(join(__dirname, '..', 'views'));

  await app.listen(3001);
}
bootstrap();
