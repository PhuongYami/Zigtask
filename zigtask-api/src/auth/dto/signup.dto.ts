import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';

export class SignUpDto
{
    @IsNotEmpty()
    @IsEmail( {}, { message: 'Please enter a valid email address.' } )
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength( 8, { message: 'Password must be at least 8 characters long.' } )
    password: string;
}