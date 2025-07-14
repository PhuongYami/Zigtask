import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
@Module( {
  controllers: [ TasksController ],
  providers: [ TasksService ],
  imports: [ TypeOrmModule.forFeature( [ Task, User ] ) ],
} )
export class TasksModule { }
