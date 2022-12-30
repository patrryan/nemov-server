import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth-guard';
import { UpdateUserInput } from './dto/update-user.input';
import { CreateUserInput } from './dto/create-user.input';
import { CurrentUser } from 'src/commons/decorators/current-user.decorator';
import { GraphQLBusinessLicenseNumber } from 'src/commons/graphql/customTypes/businessLicenseNumber.type';
import { GraphQLEmail } from 'src/commons/graphql/customTypes/email.type';
import { GraphQLPassword } from 'src/commons/graphql/customTypes/password.type';

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

  @Mutation(() => Boolean)
  checkBusinessLicenseNumber(
    @Args('bln', { type: () => GraphQLBusinessLicenseNumber }) bln: string,
  ): Promise<boolean> {
    return this.usersService.checkBLN({ bln });
  }

  @Mutation(() => Boolean)
  checkEmailExist(
    @Args('email', { type: () => GraphQLEmail })
    email: string,
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
    @CurrentUser() id: string,
    @Args('password', { type: () => GraphQLPassword }) password: string,
  ): Promise<boolean> {
    return this.usersService.verifyPassword({ id, password });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  updateUser(
    @CurrentUser() id: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return this.usersService.update({ id, updateUserInput });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async updateUserPassword(
    @CurrentUser() id: string,
    @Args('password', { type: () => GraphQLPassword }) password: string,
  ): Promise<User> {
    return this.usersService.updatePassword({ id, password });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteLoginUser(@CurrentUser() id: string): Promise<boolean> {
    return this.usersService.loginDelete({ id });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  restoreUser(
    @Args('email', { type: () => GraphQLEmail }) email: string,
  ): Promise<boolean> {
    return this.usersService.restore({ email });
  }
}
