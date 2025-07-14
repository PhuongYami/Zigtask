// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';

@Module( {
  imports: [
    ConfigModule.forRoot( { isGlobal: true } ), // Để có thể truy cập biến môi trường ở mọi nơi
    TypeOrmModule.forRoot( {
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt( process.env.DB_PORT || '5432', 10 ),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'zigtask',
      autoLoadEntities: true, // Tự động load các entities
      synchronize: true, // Chỉ dùng cho development, tự động tạo bảng
    } ), UsersModule, AuthModule, TasksModule,
  ],
  // ...
} )
export class AppModule { }