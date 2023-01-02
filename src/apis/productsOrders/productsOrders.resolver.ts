import {
  Args,
  GraphQLISODateTime,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { ProductsOrdersService } from './productsOrders.service';
import { ProductOrder } from './entities/productOrder.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser } from 'src/commons/decorators/current-user.decorator';

@Resolver()
export class ProductsOrdersResolver {
  constructor(
    private readonly productsOrdersService: ProductsOrdersService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [ProductOrder])
  fetchProductOrdersByBuyer(
    @Args('startDate', { type: () => GraphQLISODateTime, nullable: true })
    startDate: Date,
    @Args('endDate', { type: () => GraphQLISODateTime, nullable: true })
    endDate: Date,
    @Args('page', { type: () => Int }) page: number,
    @CurrentUser() id: string,
  ) {
    return this.productsOrdersService.findAllByBuyer({
      startDate,
      endDate,
      page,
      id,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Int)
  fetchProductOrdersCountByBuyer(
    @Args('startDate', { type: () => GraphQLISODateTime, nullable: true })
    startDate: Date,
    @Args('endDate', { type: () => GraphQLISODateTime, nullable: true })
    endDate: Date,
    @CurrentUser() id: string,
  ) {
    return this.productsOrdersService.findAllCountByBuyer({
      startDate,
      endDate,
      id,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [ProductOrder])
  fetchProductOrdersBySeller(
    @Args('startDate', { type: () => GraphQLISODateTime, nullable: true })
    startDate: Date,
    @Args('endDate', { type: () => GraphQLISODateTime, nullable: true })
    endDate: Date,
    @Args('page', { type: () => Int }) page: number,
    @CurrentUser() id: string,
  ) {
    return this.productsOrdersService.findAllBySeller({
      startDate,
      endDate,
      page,
      id,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Int)
  fetchProductOrdersCountBySeller(
    @Args('startDate', { type: () => GraphQLISODateTime, nullable: true })
    startDate: Date,
    @Args('endDate', { type: () => GraphQLISODateTime, nullable: true })
    endDate: Date,
    @CurrentUser() id: string,
  ) {
    return this.productsOrdersService.findAllCountBySeller({
      startDate,
      endDate,
      id,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => ProductOrder)
  createProductOrder(
    @Args('productId', { type: () => ID }) productId: string,
    @Args('amount', { type: () => Int }) amount: number,
    @Args('quantity', { type: () => Int }) quantity: number,
    @CurrentUser() id: string,
  ) {
    return this.productsOrdersService.create({
      productId,
      amount,
      quantity,
      id,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  cancelProductOrder(
    @Args('productOrderId', { type: () => ID }) productOrderId: string,
    @CurrentUser() id: string,
  ) {
    return this.productsOrdersService.cancelOrder({
      productOrderId,
      id,
    });
  }
}
