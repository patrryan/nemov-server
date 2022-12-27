import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { IContext } from 'src/common/types/context';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // 유저정보 생성
  @Mutation(() => User)
  async createUser(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('name') name: string,
    @Args('address') address: string,
    @Args('phoneNumber') phoneNumber: string,
    @Args('veganLevel') veganLevel: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersService.create({
      email,
      hashedPassword,
      name,
      address,
      phoneNumber,
      veganLevel,
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

  // 유저정보 삭제
  @Mutation(() => Boolean)
  async deleteUser(
    @Args('email') email: string, //
  ): Promise<boolean> {
    return this.usersService.delete({ email });
  }

  // 유저정보 복구
  @Mutation(() => Boolean)
  async restoreUser(
    @Args('email') email: string, //
  ): Promise<boolean> {
    return this.usersService.restore({ email });
  }
}
