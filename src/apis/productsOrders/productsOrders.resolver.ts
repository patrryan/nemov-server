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
import {
  GqlBuyerAccessGuard,
  GqlSellerAccessGuard,
} from 'src/commons/auth/gql-auth.guard';
import { CurrentUser } from 'src/commons/decorators/current-user.decorator';
import { CreateProductOrderInput } from './dto/create-product-order.input';

@Resolver()
export class ProductsOrdersResolver {
  constructor(
    private readonly productsOrdersService: ProductsOrdersService, //
  ) {}

  @UseGuards(GqlBuyerAccessGuard)
  @Query(() => [ProductOrder])
  fetchProductOrdersByBuyer(
    @Args('startDate', { type: () => GraphQLISODateTime, nullable: true })
    startDate: Date,
    @Args('endDate', { type: () => GraphQLISODateTime, nullable: true })
    endDate: Date,
    @Args('page', { type: () => Int }) page: number,
    @CurrentUser() id: string,
  ): Promise<ProductOrder[]> {
    return this.productsOrdersService.findAllByBuyer({
      startDate,
      endDate,
      page,
      id,
    });
  }

  @UseGuards(GqlBuyerAccessGuard)
  @Query(() => Int)
  fetchProductOrdersCountByBuyer(
    @Args('startDate', { type: () => GraphQLISODateTime, nullable: true })
    startDate: Date,
    @Args('endDate', { type: () => GraphQLISODateTime, nullable: true })
    endDate: Date,
    @CurrentUser() id: string,
  ): Promise<number> {
    return this.productsOrdersService.findAllCountByBuyer({
      startDate,
      endDate,
      id,
    });
  }

  @UseGuards(GqlBuyerAccessGuard)
  @Query(() => Int)
  fetchProductOrdersCountOfBought(
    @CurrentUser() id: string, //
  ): Promise<number> {
    return this.productsOrdersService.findAllCountOfBought({ id });
  }

  @UseGuards(GqlSellerAccessGuard)
  @Query(() => [ProductOrder])
  fetchProductOrdersBySeller(
    @Args('startDate', { type: () => GraphQLISODateTime, nullable: true })
    startDate: Date,
    @Args('endDate', { type: () => GraphQLISODateTime, nullable: true })
    endDate: Date,
    @Args('page', { type: () => Int }) page: number,
    @CurrentUser() id: string,
  ): Promise<ProductOrder[]> {
    return this.productsOrdersService.findAllBySeller({
      startDate,
      endDate,
      page,
      id,
    });
  }

  @UseGuards(GqlSellerAccessGuard)
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

  @UseGuards(GqlBuyerAccessGuard)
  @Query(() => [ProductOrder])
  fetchProductOrdersWithoutReview(
    @Args('page', { type: () => Int }) page: number,
    @CurrentUser() id: string,
  ): Promise<ProductOrder[]> {
    return this.productsOrdersService.findAllWithoutReview({
      page,
      id,
    });
  }

  @UseGuards(GqlBuyerAccessGuard)
  @Query(() => Int)
  fetchProductOrdersCountWithoutReview(
    @CurrentUser() id: string, //
  ): Promise<number> {
    return this.productsOrdersService.findAllCountWithoutReview({ id });
  }

  @UseGuards(GqlBuyerAccessGuard)
  @Mutation(() => String)
  createProductOrders(
    @Args('productOrders', { type: () => [CreateProductOrderInput] })
    productOrders: CreateProductOrderInput[],
    @Args('amount', { type: () => Int, description: '총 구매 금액' })
    amount: number,
    @CurrentUser() id: string,
  ): Promise<string> {
    return this.productsOrdersService.create({ productOrders, amount, id });
  }

  @UseGuards(GqlBuyerAccessGuard)
  @Mutation(() => Boolean)
  cancelProductOrder(
    @Args('productOrderId', { type: () => ID }) productOrderId: string,
    @CurrentUser() id: string,
  ): Promise<boolean> {
    return this.productsOrdersService.cancelOrder({
      productOrderId,
      id,
    });
  }
}
