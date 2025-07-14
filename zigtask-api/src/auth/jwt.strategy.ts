import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor (
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  )
  {
    super( {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>( 'JWT_SECRET' ) || 'your-secret-key',
      passReqToCallback: false,
    } );
  }

  // Hàm này sẽ được Passport gọi sau khi xác thực token thành công
  // Payload đã được giải mã sẽ được truyền vào đây
  async validate ( payload: JwtPayload ): Promise<User>
  {
    const user = await this.usersService.findOneByEmail( payload.email );
    if ( !user )
    {
      throw new UnauthorizedException( 'User not found' );
    }
    // Đối tượng trả về từ đây sẽ được gán vào request.user
    return user;
  }
}