import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {
    constructor (
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
    )
    {
        super( {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'fallbackSecretKey',
        } );
    }

    // Hàm này sẽ được Passport gọi sau khi xác thực token thành công
    // Payload đã được giải mã sẽ được truyền vào đây
    async validate ( payload: { sub: string; email: string } ): Promise<User>
    {
        const user = await this.usersService.findOneByEmail( payload.email );
        if ( !user )
        {
            throw new UnauthorizedException();
        }
        // Đối tượng trả về từ đây sẽ được gán vào request.user
        return user;
    }
}