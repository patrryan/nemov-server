import {
  UnprocessableEntityException,
  UseGuards,
  CACHE_MANAGER,
  Inject,
} from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { IContext } from 'src/commons/types/context';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import {
  GqlAuthAccessGuard,
  GqlAuthRefreshGuard,
} from 'src/commons/auth/gql-auth.guard';
import { Cache } from 'cache-manager';
import * as jwt from 'jsonwebtoken';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly usersService: UsersService, //
    private readonly authService: AuthService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @Mutation(() => String)
  async login(
    @Args('email') email: string, //
    @Args('password') password: string,
    @Context() context: IContext,
  ): Promise<string> {
    // 로그인
    const user = await this.usersService.findOneByEmail({ email });
    if (!user)
      throw new UnprocessableEntityException('등록된 이메일이 아닙니다.');

    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth)
      throw new UnprocessableEntityException('비밀번호가 틀렸습니다.');

    this.authService.setRefreshToken({
      id: user.id,
      res: context.res,
      req: context.req,
    });
    return this.authService.getAccessToken({ id: user.id });
  }

  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreAccessToken(@Context() context: IContext): string {
    return this.authService.getAccessToken({ id: context.req.user.id });
  }
  //--------------------------------------

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async logout(@Context() context: IContext) {
    const accessToken = context.req.headers.authorization.replace(
      'Bearer ',
      '',
    );
    // console.log('==============', accessToken);
    const refreshToken = context.req.headers.cookie.replace(
      'refreshToken=',
      '',
    );

    // console.log('==============', refreshToken);

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
        // 캐시매니저에 저장
        `accessToken = ${accessToken}`,
        'accessToken',
        { ttl: ttlOfAccess },
      );

      verifiedRefresh;
      await this.cacheManager.set(
        // 캐시매니저 저장
        `refreshToken = ${refreshToken}`,
        'refreshToken',
        { ttl: ttlOfRefresh },
      );
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }

    return '로그아웃 성공';
  }
}
