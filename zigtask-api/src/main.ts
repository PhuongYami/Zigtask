// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // <-- Import
import { ValidationPipe } from '@nestjs/common'; // <-- Import

async function bootstrap ()
{
  const app = await NestFactory.create( AppModule );

  // Bật CORS (đã có từ trước nhưng để đây cho đủ)
  app.enableCors();

  // Bật ValidationPipe toàn cục để DTOs hoạt động
  app.useGlobalPipes( new ValidationPipe() );

  // --- Cấu hình Swagger ---
  const config = new DocumentBuilder()
    .setTitle( 'ZigTask API' )
    .setDescription( 'The official API documentation for the ZigTask application' )
    .setVersion( '1.0' )
    .addBearerAuth( {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    }, 'bearer' )
    .addSecurityRequirements( 'bearer' )
    .build();


  const document = SwaggerModule.createDocument( app, config );
  SwaggerModule.setup( 'docs', app, document ); // API docs sẽ có tại URL /docs
  // -------------------------

  await app.listen( 3000 );
}
bootstrap();