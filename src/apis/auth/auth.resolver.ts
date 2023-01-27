import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { IContext } from 'src/commons/types/context';
import { AuthService } from './auth.service';
import {
  GqlAuthAccessGuard,
  GqlAuthRefreshGuard,
} from 'src/commons/auth/gql-auth.guard';
import { GraphQLEmail } from 'src/commons/graphql/customTypes/email.type';
import { GraphQLPassword } from 'src/commons/graphql/customTypes/password.type';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService, //
  ) {}

  @Mutation(() => String)
  login(
    @Args('email', { type: () => GraphQLEmail }) email: string, //
    @Args('password', { type: () => GraphQLPassword }) password: string,
    @Context() context: IContext,
  ): Promise<string> {
    return this.authService.login({ email, password, context });
  }

  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreAccessToken(
    @Context() context: IContext, //
  ): string {
    return this.authService.getAccessToken({
      id: context.req.user.id,
      role: context.req.user.role,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  logout(
    @Context() context: IContext, //
  ) {
    return this.authService.logout({
      req: context.req,
      res: context.res,
    });
  }
}
