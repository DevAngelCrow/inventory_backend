import { UnauthorizedException } from '@/shared/application/exceptions/unauthorized.exception';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt.strategy';
import { UserReadRepository } from '@/modules/identity-access-management/application/repositories/user-read.repository';

export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly userRepository: UserReadRepository,
    configService: ConfigService,
  ) {
    const jwtRefreshSecret = configService.get<string>('JWT_REFRESH_SECRET')!;
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtRefreshSecret,
      passReqToCallback: true,
    });
  }
  async validate(request: Request, payload: JwtPayload) {
    const refreshToken = request
      .get('Authorization')
      ?.replace('Bearer ', '')
      .trim();

    if (!refreshToken) {
      throw new UnauthorizedException(
        'Invalid token: refresh token does not exist',
      );
    }

    const user = await this.userRepository.getOneByIdForAuth(payload.id);
    if (!user) {
      throw new UnauthorizedException('Invalid token: user does not exist');
    }
    return {
      user_name: payload.user_name,
      id: payload.id,
    };
  }
}
