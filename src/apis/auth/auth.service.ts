import {
  Injectable,
  UnprocessableEntityException,
  CACHE_MANAGER,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IContext } from 'src/commons/types/context';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UsersService } from '../users/users.service';
import {
  IAuthServiceGetAccessToken,
  IAuthServiceLogin,
  IAuthServiceSetRefreshToken,
} from './interface/auth-service.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async login({
    email,
    password,
    context,
  }: IAuthServiceLogin): Promise<string> {
    const user = await this.usersService.findOneByEmail({ email });

    if (!user || user.name.includes('[탈퇴]'))
      throw new UnprocessableEntityException('가입된 회원이 아닙니다.');

    const isCorrect = await bcrypt.compare(password, user.password);

    if (!isCorrect)
      throw new UnprocessableEntityException('가입된 회원이 아닙니다.');

    this.setRefreshToken({
      id: user.id,
      role: user.role,
      req: context.req,
      res: context.res,
    });

    return this.getAccessToken({ id: user.id, role: user.role });
  }

  setRefreshToken({ id, role, req, res }: IAuthServiceSetRefreshToken): void {
    const refreshToken = this.jwtService.sign(
      { id, role },
      { secret: process.env.JWT_REFRESH_KEY, expiresIn: '2w' },
    );

    if (process.env.DEPLOY_ENV === 'LOCAL') {
      res.setHeader('Set-Cookie', `refreshToken=${refreshToken}`);
    } else {
      const allowedOrigins = [
        'http://localhost:3000',
        'https://code-backend.shop/graphql',
        'https://nemov.store',
      ];

      const origin = req.headers.origin;
      if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET,HEAD,OPTIONS,POST,PUT',
      );
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
      );
      res.setHeader(
        'Set-Cookie',
        `refreshToken=${refreshToken}; path=/; domain=.code-backend.shop; SameSite=None; Secure; httpOnly;`,
      );
    }
  }

  getAccessToken({ id, role }: IAuthServiceGetAccessToken): string {
    return this.jwtService.sign(
      { id, role },
      { secret: process.env.JWT_ACCESS_KEY, expiresIn: '1h' },
    );
  }

  async logout({ req, res }: IContext) {
    const accessToken = req.headers.authorization.replace('Bearer ', '');

    const refreshToken = req.headers.cookie.replace('refreshToken=', '');

    const verifiedAccess = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);

    const verifiedRefresh = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_KEY,
    );

    const current = new Date().getTime();

    const ttlOfAccess = Math.trunc(
      (verifiedAccess['exp'] * 1000 - current) / 1000,
    );

    const ttlOfRefresh = Math.trunc(
      (verifiedRefresh['exp'] * 1000 - current) / 1000,
    );

    try {
      verifiedAccess;
      await this.cacheManager.set(
        `accessToken = ${accessToken}`,
        'accessToken',
        { ttl: ttlOfAccess },
      );

      verifiedRefresh;
      await this.cacheManager.set(
        `refreshToken = ${refreshToken}`,
        'refreshToken',
        { ttl: ttlOfRefresh },
      );
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }

    if (process.env.DEPLOY_ENV === 'LOCAL') {
      res.setHeader('Set-Cookie', `refreshToken=`);
    } else {
      res.setHeader(
        'Set-Cookie',
        `refreshToken=; path=/; domain=.code-backend.shop; SameSite=None; Secure; httpOnly;`,
      );
    }

    return '로그아웃 성공';
  }
}
