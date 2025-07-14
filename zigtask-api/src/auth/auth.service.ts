import
{
    Injectable,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService
{
    constructor (
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async signUp ( signUpDto: SignUpDto ): Promise<{ message: string }>
    {
        const { email } = signUpDto;

        // 1. Kiểm tra xem email đã tồn tại chưa
        const existingUser = await this.usersService.findOneByEmail( email );
        if ( existingUser )
        {
            throw new ConflictException( 'Email already registered' );
        }

        // 2. Tạo người dùng mới (mật khẩu đã được tự động hash bởi hook trong UserEntity)
        await this.usersService.create( signUpDto );

        return { message: 'User registered successfully' };
    }

    async signIn ( signInDto: SignInDto ): Promise<{ accessToken: string }>
    {
        const { email, password } = signInDto;

        // 1. Tìm người dùng bằng email
        const user = await this.usersService.findOneByEmail( email );
        if ( !user )
        {
            throw new UnauthorizedException( 'Invalid credentials' );
        }

        // 2. So sánh mật khẩu
        const isPasswordMatching = await bcrypt.compare( password, user.password );
        if ( !isPasswordMatching )
        {
            throw new UnauthorizedException( 'Invalid credentials' );
        }

        // 3. Tạo JWT Payload
        const payload = { sub: user.id, email: user.email };

        // 4. Ký và trả về token
        const accessToken = await this.jwtService.signAsync( payload );

        return { accessToken };
    }
}