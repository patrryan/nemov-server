import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_KEY,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }
  async validate(req, payload) {
    const accessToken = req.headers.authorization.replace('Bearer ', '');
    const checkAccess = await this.cacheManager.get(
      `accessToken = ${accessToken}`,
    );

    if (checkAccess) {
      throw new UnauthorizedException('로그아웃된 토큰입니다.');
    }

    return {
      id: payload.id,
    };
  }
}
