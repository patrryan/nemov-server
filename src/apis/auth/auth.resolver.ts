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

@Resolver()
export class AuthResolver {
  constructor(
    private readonly usersService: UsersService, //
    private readonly authService: AuthService,
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

  //--------------------------------------

  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreAccessToken(@Context() context: IContext): string {
    return this.authService.getAccessToken({ id: context.req.user.id });
  }
  //--------------------------------------

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async logout(
    //
    @Context() context: IContext,
  ) {
    return this.authService.logout({
      req: context.req,
      res: context.res,
    });
  }
}
