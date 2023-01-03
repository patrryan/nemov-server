import { UseGuards } from '@nestjs/common';
import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser } from 'src/commons/decorators/current-user.decorator';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { PRODUCT_CATEGORY_TYPE } from './entities/product.entity';

@Resolver()
export class ProductsResolver {
  constructor(
    private readonly productsService: ProductsService, //
  ) {}

  ///-----------------------------///

  @Query(() => [Product])
  fetchProducts(
    @Args('category', { type: () => PRODUCT_CATEGORY_TYPE }) category: string, //
    @Args({ name: 'veganLevel', type: () => Int })
    veganLevel: number,
    @Args({ name: 'page', type: () => Int })
    page: number,
  ) {
    return this.productsService.findAll({ category, page, veganLevel });
  }

  ///-----------------------------///

  @Query(() => Product)
  fetchProduct(
    @Args('productId', { type: () => ID }) productId: string, //
  ): Promise<Product> {
    return this.productsService.findOne({ productId });
  }
  ///-----------------------------///

  @Query(() => Int)
  fetchProductsCount(
    @Args('category', { type: () => PRODUCT_CATEGORY_TYPE }) category: string, //
    @Args({ name: 'veganLevel', type: () => Int })
    veganLevel: number,
  ) {
    return this.productsService.findCount({ category, veganLevel });
  }

  ///-----------------------------///
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Product])
  fetchProductsBySeller(
    @Args({ name: 'page', type: () => Int }) page: number,
    @CurrentUser() id: string,
  ) {
    return this.productsService.findProductBySeller({ id, page });
  }

  @Query(() => [Product])
  fetchProductsOfRecommend() {
    return this.productsService.findByRecommend();
  }

  @Query(() => [Product])
  fetchProductsOfBestSelling() {
    return this.productsService.findBySelling();
  }

  ///-----------------------------///
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Product)
  createProduct(
    @CurrentUser() id: string, //
    @Args('createProductInput') createProductInput: CreateProductInput,
  ): Promise<Product> {
    return this.productsService.create({ createProductInput, id });
  }

  ///-----------------------------///
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Product)
  async updateProduct(
    @Args('productId', { type: () => ID }) productId: string,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    const product = await this.productsService.findOne({ productId });

    return this.productsService.update({ product, updateProductInput });
  }

  ///-----------------------------///
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteProduct(
    @Args('productId', { type: () => ID }) productId: string, //
  ): Promise<boolean> {
    return this.productsService.delete({ productId });
  }

  ///-----------------------------///
}
