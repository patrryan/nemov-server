import { UseGuards } from '@nestjs/common';
import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser } from 'src/commons/decorators/current-user.decorator';
import { Product } from '../products/entities/product.entity';
import { CartService } from './cart.service';
import { CartOutput } from './dto/cart.ouput';

@Resolver()
export class CartResolver {
  constructor(
    private readonly cartService: CartService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [CartOutput])
  fetchCart(
    @CurrentUser() id: string, //
  ): Promise<Product[]> {
    return this.cartService.findAll({ id });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Int)
  fetchCartCount(
    @CurrentUser() id: string, //
  ) {
    return this.cartService.findAllCount({ id });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Boolean)
  fetchIsInCart(
    @Args('productId', { type: () => ID }) productId: string,
    @CurrentUser() id: string,
  ): Promise<boolean> {
    return this.cartService.findOne({ productId, id });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  toggleProductToCart(
    @Args('productId', { type: () => ID }) productId: string,
    @Args('count', { type: () => Int, nullable: true }) count: number,
    @CurrentUser() id: string,
  ): Promise<boolean> {
    return this.cartService.create({ productId, count, id });
  }
}
