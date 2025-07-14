// src/tasks/entities/task.entity.ts
import
    {
        Entity,
        PrimaryGeneratedColumn,
        Column,
        ManyToOne,
        JoinColumn,
    } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TaskStatus } from '../task-status.enum';

@Entity( 'tasks' )
export class Task
{
    @PrimaryGeneratedColumn( 'uuid' )
    id: string;

    @Column( { nullable: false } )
    title: string;

    @Column( { type: 'text', nullable: true } )
    description: string;

    @Column( {
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.TO_DO,
    } )
    status: TaskStatus;

    @Column( { type: 'timestamp', nullable: true } )
    dueDate: Date;

    // Thiết lập mối quan hệ: Nhiều Task thuộc về một User
    @ManyToOne( () => User, ( user ) => user.tasks, { eager: false } )
    @JoinColumn( { name: 'userId' } ) // Tạo cột 'userId' trong bảng 'tasks'
    user: User;

    @Column() // TypeORM sẽ tự động tạo cột này từ quan hệ trên
    userId: string;
}