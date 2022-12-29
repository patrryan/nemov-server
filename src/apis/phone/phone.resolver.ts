import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import { PhoneService } from './phone.service';

@Resolver()
export class PhoneResolver {
  constructor(
    private readonly phoneService: PhoneService, //
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  // 핸드폰 토큰
  @Mutation(() => String)
  async getToken(
    @Args('phoneNumber') phoneNumber: string, //
  ) {
    return await this.phoneService.sendTokenToSMS({
      phone: phoneNumber,
    });
  }

  // 핸드폰 토큰인증 검증
  @Mutation(() => String)
  async checkValidToken(
    @Args('phoneNumber') phoneNumber: string,
    @Args('token') token: string,
  ) {
    return await this.phoneService.checkToken({ phoneNumber, token });
  }
}
