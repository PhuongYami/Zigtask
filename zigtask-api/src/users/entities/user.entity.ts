// src/users/entities/user.entity.ts

import
{
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert,
    OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Task } from '../../tasks/entities/task.entity'; // Sẽ tạo ở bước sau

@Entity( 'users' ) // Đặt tên cho bảng trong database là 'users'
export class User
{
    @PrimaryGeneratedColumn( 'uuid' ) // Sử dụng UUID cho ID để tăng tính bảo mật
    id: string;

    @Column( { unique: true, nullable: false } ) // Email là duy nhất và không được rỗng
    email: string;

    @Column( { nullable: false, select: false } ) // Mật khẩu không được rỗng và không được trả về khi query
    password: string;

    // Thiết lập mối quan hệ: Một User có thể có nhiều Task
    @OneToMany( () => Task, ( task ) => task.user )
    tasks: Task[];

    // Đây là một "hook" của TypeORM.
    // Hàm này sẽ tự động được gọi TRƯỚC KHI một bản ghi User mới được chèn vào DB.
    @BeforeInsert()
    async hashPassword ()
    {
        // Chỉ hash nếu mật khẩu được cung cấp (tránh hash lại khi không cần thiết)
        if ( this.password )
        {
            const salt = await bcrypt.genSalt();
            this.password = await bcrypt.hash( this.password, salt );
        }
    }
}