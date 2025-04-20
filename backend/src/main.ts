import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('MLOA Raid Manager API')
    .setDescription('로스트아크 공격대 관리 시스템 API 문서')
    .setVersion('1.0')
    .addTag('raid-manager')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(8000);
  console.log(`서버가 http://localhost:8000 포트에서 실행 중입니다`);
}
bootstrap();
