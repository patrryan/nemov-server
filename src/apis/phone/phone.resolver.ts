import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLPhone } from 'src/commons/graphql/customTypes/phone.type';
import { PhoneService } from './phone.service';

@Resolver()
export class PhoneResolver {
  constructor(
    private readonly phoneService: PhoneService, //
  ) {}

  @Mutation(() => String)
  getToken(
    @Args('phone', { type: () => GraphQLPhone }) phone: string, //
  ): Promise<string> {
    return this.phoneService.sendTokenToSMS({
      phone,
    });
  }

  @Mutation(() => Boolean)
  checkValidToken(
    @Args('phone', { type: () => GraphQLPhone }) phone: string,
    @Args('token') token: string,
  ): Promise<boolean> {
    return this.phoneService.checkToken({ phone, token });
  }
}
