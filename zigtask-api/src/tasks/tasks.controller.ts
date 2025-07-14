// src/tasks/tasks.controller.ts
import
  {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    ParseUUIDPipe,
  } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { Task } from './entities/task.entity';

@Controller( 'tasks' )
@UseGuards( AuthGuard() ) // Bảo vệ tất cả các route trong controller này
export class TasksController
{
  constructor ( private readonly tasksService: TasksService ) { }

  @Post()
  create (
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task>
  {
    return this.tasksService.create( createTaskDto, user );
  }

  @Get()
  findAll ( @GetUser() user: User ): Promise<Task[]>
  {
    return this.tasksService.findAll( user );
  }

  @Get( ':id' )
  findOne (
    @Param( 'id', ParseUUIDPipe ) id: string,
    @GetUser() user: User,
  ): Promise<Task>
  {
    return this.tasksService.findOne( id, user );
  }

  @Patch( ':id' )
  update (
    @Param( 'id', ParseUUIDPipe ) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: User,
  ): Promise<Task>
  {
    return this.tasksService.update( id, updateTaskDto, user );
  }

  @Delete( ':id' )
  remove (
    @Param( 'id', ParseUUIDPipe ) id: string,
    @GetUser() user: User,
  ): Promise<void>
  {
    return this.tasksService.remove( id, user );
  }
}