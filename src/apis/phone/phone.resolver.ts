import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import { GraphQLPhone } from 'src/commons/graphql/customTypes/phone.type';
import { PhoneService } from './phone.service';
@Resolver()
export class PhoneResolver {
  constructor(
    private readonly phoneService: PhoneService, //
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}
  @Mutation(() => String)
  getToken(
    @Args('phone', { type: () => GraphQLPhone }) phone: string, //
  ) {
    return this.phoneService.sendTokenToSMS({
      phone,
    });
  }
  @Mutation(() => String)
  checkValidToken(
    @Args('phone', { type: () => GraphQLPhone }) phone: string,
    @Args('token') token: string,
  ) {
    return this.phoneService.checkToken({ phone, token });
  }
}
