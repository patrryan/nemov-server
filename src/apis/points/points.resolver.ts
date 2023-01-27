import { UseGuards } from '@nestjs/common';
import {
  Args,
  GraphQLISODateTime,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
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
  @Query(() => [Point])
  fetchPointTransactions(
    @Args('startDate', { type: () => GraphQLISODateTime, nullable: true })
    startDate: Date,
    @Args('endDate', { type: () => GraphQLISODateTime, nullable: true })
    endDate: Date,
    @Args('page', { type: () => Int }) page: number,
    @CurrentUser() id: string,
  ): Promise<Point[]> {
    return this.pointsService.findAllByUser({ startDate, endDate, page, id });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Int)
  fetchPointTransactionsCount(
    @Args('startDate', { type: () => GraphQLISODateTime, nullable: true })
    startDate: Date,
    @Args('endDate', { type: () => GraphQLISODateTime, nullable: true })
    endDate: Date,
    @CurrentUser() id: string, //
  ): Promise<number> {
    return this.pointsService.findAllCountByUser({ startDate, endDate, id });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Point)
  createPointCharge(
    @Args('impUid', {
      type: () => ID,
      description: '포인트 결제를 진행한 imp 결제번호',
    })
    impUid: string,
    @Args('amount', { type: () => Int, description: '포인트 충전 금액' })
    amount: number,
    @CurrentUser() id: string,
  ): Promise<Point> {
    return this.pointsService.createPointCharge({
      impUid,
      amount,
      id,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Point)
  cancelPointCharge(
    @Args('impUid', { type: () => ID }) impUid: string, //
    @CurrentUser() id: string,
  ): Promise<Point> {
    return this.pointsService.cancelPointCharge({
      impUid,
      id,
    });
  }
}
