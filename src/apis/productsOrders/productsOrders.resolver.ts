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
import { CreateProductOrderInput } from './dto/create-product-order.input';

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
  @Query(() => Int)
  fetchProductOrdersCountOfBought(
    @CurrentUser() id: string, //
  ) {
    return this.productsOrdersService.findAllCountOfBought({ id });
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
  @Query(() => [ProductOrder])
  fetchProductOrdersWithoutReview(
    @Args('page', { type: () => Int }) page: number,
    @CurrentUser() id: string,
  ) {
    return this.productsOrdersService.findAllWithoutReview({
      page,
      id,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Int)
  fetchProductOrdersCountWithoutReview(
    @CurrentUser() id: string, //
  ) {
    return this.productsOrdersService.findAllCountWithoutReview({ id });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  createProductOrders(
    @Args('productOrders', { type: () => [CreateProductOrderInput] })
    productOrders: CreateProductOrderInput[],
    @Args('amount', { type: () => Int, description: '총 구매 금액' })
    amount: number,
    @CurrentUser() id: string,
  ) {
    return this.productsOrdersService.create({ productOrders, amount, id });
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
