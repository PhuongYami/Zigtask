// src/tasks/tasks.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService
{
  constructor (
    @InjectRepository( Task )
    private tasksRepository: Repository<Task>,
  ) { }

  async create ( createTaskDto: CreateTaskDto, user: User ): Promise<Task>
  {
    const newTask = this.tasksRepository.create( {
      ...createTaskDto,
      status: createTaskDto.status || TaskStatus.TO_DO, // Gán trạng thái mặc định
      user, // Gán công việc này cho người dùng đã đăng nhập
    } );

    await this.tasksRepository.save( newTask );
    return newTask;
  }

  async findAll ( user: User ): Promise<Task[]>
  {
    return this.tasksRepository.find( {
      where: { userId: user.id },
      order: {
        dueDate: 'ASC',
      },
    } );
  }

  async findOne ( id: string, user: User ): Promise<Task>
  {
    const task = await this.tasksRepository.findOne( { where: { id, userId: user.id } } );
    if ( !task )
    {
      throw new NotFoundException( `Task with ID "${ id }" not found` );
    }
    return task;
  }

  async update ( id: string, updateTaskDto: UpdateTaskDto, user: User ): Promise<Task>
  {
    const task = await this.findOne( id, user ); // findOne đã kiểm tra quyền sở hữu

    Object.assign( task, updateTaskDto );

    await this.tasksRepository.save( task );
    return task;
  }

  async remove ( id: string, user: User ): Promise<void>
  {
    const result = await this.tasksRepository.delete( { id, userId: user.id } );
    if ( result.affected === 0 )
    {
      throw new NotFoundException( `Task with ID "${ id }" not found` );
    }
  }
}