import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { UpdateUserInput } from './dto/update-user.input';
import { CreateUserInput } from './dto/create-user.input';
import { CurrentUser } from 'src/commons/decorators/current-user.decorator';
import { GraphQLBusinessLicenseNumber } from 'src/commons/graphql/customTypes/businessLicenseNumber.type';
import { GraphQLEmail } from 'src/commons/graphql/customTypes/email.type';
import { GraphQLPassword } from 'src/commons/graphql/customTypes/password.type';
import { GraphQLPhone } from 'src/commons/graphql/customTypes/phone.type';
import { IContext } from 'src/commons/types/context';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  fetchLoginUser(
    @CurrentUser() id: string, //
  ): Promise<User> {
    return this.usersService.findOneById({ id });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Int)
  fetchUserPoint(
    @CurrentUser() id: string, //
  ) {
    return this.usersService.findPointByUser({ id });
  }

  @Mutation(() => GraphQLEmail)
  findEmail(
    @Args('name') name: string,
    @Args('phone', { type: () => GraphQLPhone }) phone: string, //
  ) {
    return this.usersService.findEmailByPhone({ name, phone });
  }

  @Mutation(() => Boolean)
  findPassword(
    @Args('email', { type: () => GraphQLEmail }) email: string,
    @Args('password', { type: () => GraphQLPassword }) password: string,
  ) {
    return this.usersService.updatePasswordByEmail({ email, password });
  }

  @Mutation(() => Boolean)
  checkBusinessLicenseNumber(
    @Args('bln', { type: () => GraphQLBusinessLicenseNumber }) bln: string,
  ): Promise<boolean> {
    return this.usersService.checkBLN({ bln });
  }

  @Mutation(() => Boolean)
  checkEmailExist(
    @Args('email', { type: () => GraphQLEmail }) email: string,
  ): Promise<boolean> {
    return this.usersService.checkEmail({ email });
  }

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.usersService.create({
      createUserInput,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async checkUserPassword(
    @Args('password', { type: () => GraphQLPassword }) password: string,
    @CurrentUser() id: string,
  ): Promise<boolean> {
    return this.usersService.verifyPassword({ id, password });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() id: string,
  ): Promise<User> {
    return this.usersService.update({ id, updateUserInput });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async updateUserPassword(
    @Args('password', { type: () => GraphQLPassword }) password: string,
    @CurrentUser() id: string,
  ): Promise<User> {
    return this.usersService.updatePassword({ id, password });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteLoginUser(
    @Context() context: IContext, //
  ): Promise<boolean> {
    return this.usersService.delete({ req: context.req, res: context.res });
  }
}
