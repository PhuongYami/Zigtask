// src/users/dto/create-user.dto.ts

import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto
{
    @IsNotEmpty( { message: 'Email should not be empty.' } )
    @IsEmail( {}, { message: 'Please provide a valid email address.' } )
    email: string;

    @IsNotEmpty( { message: 'Password should not be empty.' } )
    @IsString()
    @MinLength( 8, { message: 'Password must be at least 8 characters long.' } )
    password: string;

    // Giả sử có thêm vai trò, chúng ta có thể thêm vào đây
    // @IsEnum(UserRole)
    // @IsOptional()
    // role?: UserRole;
}