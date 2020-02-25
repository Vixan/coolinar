import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/shared/filters/http-exception.filter';
import { ApiConfigService } from 'src/config/api-config.service';
import { useContainer } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const apiConfigService = app.get(ApiConfigService);

  app.setGlobalPrefix(apiConfigService.globalPrefix);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(apiConfigService.port, () => {
    console.log(
      `Listening at http://localhost:${apiConfigService.port}/${
        apiConfigService.globalPrefix
      }`,
    );
  });
}

bootstrap();
