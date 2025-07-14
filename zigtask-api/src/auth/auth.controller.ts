import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { ResponseUserDto } from '../users/dto/response-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/entities/user.entity';
@Controller( 'auth' )
export class AuthController
{
    constructor ( private readonly authService: AuthService ) { }
    @Post( '/signup' )
    signUp ( @Body() signUpDto: SignUpDto ): Promise<{ message: string }>
    {
        return this.authService.signUp( signUpDto );
    }
    @Post( '/signin' )
    @HttpCode( HttpStatus.OK ) // Mặc định POST trả về 201, đổi thành 200 OK
    signIn ( @Body() signInDto: SignInDto ): Promise<{ accessToken: string }>
    {
        return this.authService.signIn( signInDto );
    }

    @Get( '/me' )
    @UseGuards( AuthGuard('jwt') ) // Bảo vệ route này với JWT strategy
    getProfile ( @GetUser() user: User ): ResponseUserDto
    {
        // Trả về dữ liệu đã được định dạng, loại bỏ password
        return {
            id: user.id,
            email: user.email,
        };
    }
}