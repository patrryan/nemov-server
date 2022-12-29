import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { IContext } from 'src/commons/types/context';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth-guard';
import { UpdateUserInput } from './dto/update-user.input';
import { CreateUserInput } from './dto/create-user.input';
import { CurrentUser } from 'src/commons/decorators/current-user.decorator';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // 유저정보 생성
  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);
    return this.usersService.create({
      hashedPassword,
      createUserInput,
    });
  }

  // 이메일로 유저 조회
  @Query(() => User)
  async fetchUser(
    @Context() context: IContext, //
    @Args('email') email: string, //
  ) {
    return this.usersService.findOne({ email });
  }

  // 유저정보 복구
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async restoreUser(
    @Args('email') email: string, //
  ): Promise<boolean> {
    return this.usersService.restore({ email });
  }

  // 유저정보 업데이트
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async updateUser(
    @Context() context: IContext,
    @Args('updateUserInput') updateUserInput: UpdateUserInput, //
  ) {
    return await this.usersService.update({ context, updateUserInput });
  }

  // 로그인한 유저 비밀번호 변경
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async updateUserPwd(
    @Context() context: IContext,
    @Args('password') password: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.findOne({
      email: context.req.user.email,
    });
    return this.usersService.updatePwd({ hashedPassword, user });
  }

  // 로그인한 유저 한 사람 조회
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  async fetchLoginUser(@CurrentUser() id: string) {
    return this.usersService.findOneById({ id });
  }

  // 로그인한 유저 삭제
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteLoginUser(
    @Context() context: IContext, //
  ) {
    return this.usersService.loginDelete({ context });
  }
}
