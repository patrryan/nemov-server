import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLPhone } from 'src/commons/graphql/customTypes/phone.type';
import { PhoneService } from './phone.service';
@Resolver()
export class PhoneResolver {
  constructor(
    private readonly phoneService: PhoneService, //
  ) {}

  @Mutation(() => String)
  getTokenForSignUp(
    @Args('phone', { type: () => GraphQLPhone }) phone: string, //
  ): Promise<string> {
    return this.phoneService.sendTokenToSMS({ phone, reason: 'signUp' });
  }
  @Mutation(() => String)
  getTokenForEmail(
    @Args('phone', { type: () => GraphQLPhone }) phone: string, //
  ) {
    return this.phoneService.sendTokenToSMS({ phone, reason: 'email' });
  }

  @Mutation(() => String)
  getTokenForPassword(
    @Args('phone', { type: () => GraphQLPhone }) phone: string, //
  ) {
    return this.phoneService.sendTokenToSMS({ phone, reason: 'password' });
  }

  @Mutation(() => Boolean)
  checkValidTokenForSignUp(
    @Args('phone', { type: () => GraphQLPhone }) phone: string,
    @Args('token') token: string,
  ): Promise<boolean> {
    return this.phoneService.checkToken({ phone, token, reason: 'signUp' });
  }

  @Mutation(() => Boolean)
  checkValidTokenForEmail(
    @Args('phone', { type: () => GraphQLPhone }) phone: string,
    @Args('token') token: string,
  ): Promise<boolean> {
    return this.phoneService.checkToken({ phone, token, reason: 'email' });
  }

  @Mutation(() => Boolean)
  checkValidTokenForPassword(
    @Args('phone', { type: () => GraphQLPhone }) phone: string,
    @Args('token') token: string,
  ): Promise<boolean> {
    return this.phoneService.checkToken({ phone, token, reason: 'password' });
  }
}
