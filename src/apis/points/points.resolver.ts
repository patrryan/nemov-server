import { UseGuards } from '@nestjs/common';
import { Args, ID, Int, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser } from 'src/commons/decorators/current-user.decorator';
import { Point } from './entities/point.entity';
import { PointsService } from './points.service';

@Resolver()
export class PointsResolver {
  constructor(
    private readonly pointsService: PointsService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Point)
  async createPointCharge(
    @Args('impUid', {
      type: () => ID,
      description: '포인트 결제를 진행한 imp 결제번호',
    })
    impUid: string,
    @Args('amount', { type: () => Int, description: '포인트 충전 금액' })
    amount: number,
    @CurrentUser() id: string,
  ) {
    return await this.pointsService.createPointCharge({
      impUid,
      amount,
      id,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Point)
  async cancelPointCharge(
    @Args('impUid', { type: () => ID }) impUid: string, //
    @CurrentUser() id: string,
  ) {
    return await this.pointsService.cancelPointCharge({
      impUid,
      id,
    });
  }
}
