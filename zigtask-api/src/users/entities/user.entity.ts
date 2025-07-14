// src/users/entities/user.entity.ts

import
{
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert,
    BeforeUpdate,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Task } from '../../tasks/entities/task.entity'; // Sẽ tạo ở bước sau

export const SALT_ROUNDS = 10;

@Entity( 'users' ) // Đặt tên cho bảng trong database là 'users'
export class User
{
    @PrimaryGeneratedColumn( 'uuid' ) // Sử dụng UUID cho ID để tăng tính bảo mật
    id: string;

    @Column( { unique: true, nullable: false } ) // Email là duy nhất và không được rỗng
    email: string;

    @Column( { nullable: false, select: false } ) // Mật khẩu không được rỗng và không được trả về khi query
    password: string;

    @CreateDateColumn( { name: 'created_at' } )
    createdAt: Date;

    @UpdateDateColumn( { name: 'updated_at' } )
    updatedAt: Date;

    // Thiết lập mối quan hệ: Một User có thể có nhiều Task
    @OneToMany( () => Task, ( task ) => task.user, { cascade: true } )
    tasks: Task[];

    // Đây là một "hook" của TypeORM.
    // Hàm này sẽ tự động được gọi TRƯỚC KHI một bản ghi User mới được chèn vào DB.
    @BeforeInsert()
    async hashPassword (): Promise<void>
    {
        // Chỉ hash nếu mật khẩu được cung cấp (tránh hash lại khi không cần thiết)
        if ( this.password )
        {
            this.password = await bcrypt.hash( this.password, SALT_ROUNDS );
        }
    }

    @BeforeUpdate()
    async updateTimestamp (): Promise<void>
    {
        this.updatedAt = new Date();
    }

    async validatePassword ( password: string ): Promise<boolean>
    {
        return bcrypt.compare( password, this.password );
    }
}