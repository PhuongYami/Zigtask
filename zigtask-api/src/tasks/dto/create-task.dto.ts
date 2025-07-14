// src/tasks/dto/create-task.dto.ts
import
    {
        IsString,
        IsNotEmpty,
        IsOptional,
        IsDateString,
        IsEnum,
    } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class CreateTaskDto
{
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum( TaskStatus )
    @IsOptional()
    status?: TaskStatus;

    @IsDateString()
    @IsOptional()
    dueDate?: Date;
}