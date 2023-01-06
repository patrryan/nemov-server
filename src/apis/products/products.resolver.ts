import { UseGuards } from '@nestjs/common';
import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser } from 'src/commons/decorators/current-user.decorator';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@Resolver()
export class ProductsResolver {
  constructor(
    private readonly productsService: ProductsService, //
  ) {}

  @Query(() => [Product])
  fetchProducts(
    @Args('productCategoryId', { type: () => ID }) productCategoryId: string,
    @Args({ name: 'veganLevel', type: () => Int })
    veganLevel: number,
    @Args({ name: 'page', type: () => Int })
    page: number,
  ) {
    return this.productsService.findAll({
      productCategoryId,
      page,
      veganLevel,
    });
  }

  @Query(() => Int)
  fetchProductsCount(
    @Args('productCategoryId', { type: () => ID }) productCategoryId: string,
    @Args({ name: 'veganLevel', type: () => Int })
    veganLevel: number,
  ) {
    return this.productsService.findCount({ productCategoryId, veganLevel });
  }

  @Query(() => Product)
  fetchProduct(
    @Args('productId', { type: () => ID }) productId: string, //
  ): Promise<Product> {
    return this.productsService.findOne({ productId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Product])
  fetchProductsBySeller(
    @Args('page', { type: () => Int }) page: number,
    @CurrentUser() id: string,
  ) {
    return this.productsService.findProductBySeller({ id, page });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Int)
  fetchProductsCountBySeller(
    @CurrentUser() id: string, //
  ) {
    return this.productsService.findAllCountBySeller({ id });
  }

  @Query(() => [Product])
  fetchProductsOfRecommend() {
    return this.productsService.findByRecommend();
  }

  @Query(() => [Product])
  fetchProductsOfBestSelling() {
    return this.productsService.findBySelling();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Product)
  createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
    @CurrentUser() id: string,
  ): Promise<Product> {
    return this.productsService.create({ createProductInput, id });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Product)
  updateProduct(
    @Args('productId', { type: () => ID }) productId: string,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
    @CurrentUser() id: string,
  ): Promise<Product> {
    return this.productsService.update({ productId, updateProductInput, id });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteProduct(
    @Args('productId', { type: () => ID }) productId: string, //
  ): Promise<boolean> {
    return this.productsService.delete({ productId });
  }
}
