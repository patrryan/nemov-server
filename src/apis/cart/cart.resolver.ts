import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser } from 'src/commons/decorators/current-user.decorator';
import { Product } from '../products/entities/product.entity';
import { CartService } from './cart.service';

@Resolver()
export class CartResolver {
  constructor(
    private readonly cartService: CartService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Product])
  fetchBasket(
    @CurrentUser() id: string, //
  ): Promise<Product[]> {
    return this.cartService.findAll({ id });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Boolean)
  fetchIsInBasket(
    @Args('productId', { type: () => ID }) productId: string,
    @CurrentUser() id: string,
  ): Promise<boolean> {
    return this.cartService.findOne({ productId, id });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  toggleProductToBasket(
    @Args('productId', { type: () => ID }) productId: string,
    @CurrentUser() id: string,
  ): Promise<boolean> {
    return this.cartService.create({ productId, id });
  }
}
