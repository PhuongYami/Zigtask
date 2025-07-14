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
    HttpCode,
    HttpStatus,
  } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import
  {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
  } from '@nestjs/swagger';

import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { Task } from './entities/task.entity';

@ApiBearerAuth() // Đánh dấu tất cả endpoint trong controller này yêu cầu xác thực Bearer Token
@ApiTags( 'Tasks' ) // Gom nhóm tất cả endpoint này dưới tag "Tasks" trong Swagger UI
@Controller( 'tasks' )
@UseGuards( AuthGuard('jwt') ) // Bảo vệ tất cả các route trong controller này với JWT strategy
export class TasksController
{
  constructor ( private readonly tasksService: TasksService ) { }

  @Post()
  @ApiOperation( { summary: 'Create a new task' } )
  @ApiResponse( {
    status: HttpStatus.CREATED,
    description: 'The task has been successfully created.',
    type: Task, // Chỉ định kiểu dữ liệu trả về cho Swagger
  } )
  @ApiResponse( {
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized. Token is not valid or not provided.',
  } )
  @ApiResponse( {
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. Invalid data provided.',
  } )
  create (
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task>
  {
    return this.tasksService.create( createTaskDto, user );
  }

  @Get()
  @ApiOperation( { summary: 'Get all tasks for the current user' } )
  @ApiResponse( {
    status: HttpStatus.OK,
    description: 'Return an array of tasks.',
    type: [ Task ], // Chỉ định kiểu dữ liệu trả về là một mảng Task
  } )
  @ApiResponse( {
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  } )
  findAll ( @GetUser() user: User ): Promise<Task[]>
  {
    return this.tasksService.findAll( user );
  }

  @Get( ':id' )
  @ApiOperation( { summary: 'Get a single task by ID' } )
  @ApiParam( { name: 'id', description: 'The ID of the task (UUID format)' } )
  @ApiResponse( {
    status: HttpStatus.OK,
    description: 'Return the task object.',
    type: Task,
  } )
  @ApiResponse( {
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  } )
  @ApiResponse( {
    status: HttpStatus.NOT_FOUND,
    description: 'Task with the specified ID not found or does not belong to the user.',
  } )
  findOne (
    @Param( 'id', ParseUUIDPipe ) id: string,
    @GetUser() user: User,
  ): Promise<Task>
  {
    return this.tasksService.findOne( id, user );
  }

  @Patch( ':id' )
  @ApiOperation( { summary: 'Update a task by ID' } )
  @ApiParam( { name: 'id', description: 'The ID of the task to update (UUID format)' } )
  @ApiResponse( {
    status: HttpStatus.OK,
    description: 'The task has been successfully updated.',
    type: Task,
  } )
  @ApiResponse( {
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  } )
  @ApiResponse( {
    status: HttpStatus.NOT_FOUND,
    description: 'Task with the specified ID not found.',
  } )
  update (
    @Param( 'id', ParseUUIDPipe ) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: User,
  ): Promise<Task>
  {
    return this.tasksService.update( id, updateTaskDto, user );
  }

  @Delete( ':id' )
  @HttpCode( HttpStatus.NO_CONTENT ) // Đặt mã trạng thái 204 cho hành động xóa thành công
  @ApiOperation( { summary: 'Delete a task by ID' } )
  @ApiParam( { name: 'id', description: 'The ID of the task to delete (UUID format)' } )
  @ApiResponse( {
    status: HttpStatus.NO_CONTENT,
    description: 'The task has been successfully deleted.',
  } )
  @ApiResponse( {
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  } )
  @ApiResponse( {
    status: HttpStatus.NOT_FOUND,
    description: 'Task with the specified ID not found.',
  } )
  remove (
    @Param( 'id', ParseUUIDPipe ) id: string,
    @GetUser() user: User,
  ): Promise<void>
  {
    return this.tasksService.remove( id, user );
  }
}