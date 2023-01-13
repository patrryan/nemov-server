import { UseGuards } from '@nestjs/common';
import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlSellerAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser } from 'src/commons/decorators/current-user.decorator';
import { CreateProductOptionInput } from '../productsOptions/dto/createProductOption.input';
import { UpdateProductOptionInput } from '../productsOptions/dto/updateProductOption.input';
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
    @Args('veganLevel', { type: () => Int })
    veganLevel: number,
    @Args('search') search: string,
    @Args('page', { type: () => Int })
    page: number,
  ) {
    return this.productsService.findAll({
      productCategoryId,
      veganLevel,
      search,
      page,
    });
  }

  @Query(() => Int)
  fetchProductsCount(
    @Args('productCategoryId', { type: () => ID }) productCategoryId: string,
    @Args('veganLevel', { type: () => Int })
    veganLevel: number,
    @Args('search') search: string,
  ) {
    return this.productsService.findCount({
      productCategoryId,
      veganLevel,
      search,
    });
  }

  @Query(() => Product)
  fetchProduct(
    @Args('productId', { type: () => ID }) productId: string, //
  ): Promise<Product> {
    return this.productsService.findOne({ productId });
  }

  @UseGuards(GqlSellerAccessGuard)
  @Query(() => [Product])
  fetchProductsBySeller(
    @Args({ name: 'page', type: () => Int }) page: number,
    @CurrentUser() id: string,
  ) {
    return this.productsService.findAllBySeller({ id, page });
  }

  @UseGuards(GqlSellerAccessGuard)
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

  @UseGuards(GqlSellerAccessGuard)
  @Mutation(() => Product)
  createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
    @Args('createProductOptionInput', { nullable: true })
    createProductOptionInput: CreateProductOptionInput,
    @CurrentUser() id: string,
  ): Promise<Product> {
    return this.productsService.create({
      createProductInput,
      createProductOptionInput,
      id,
    });
  }

  @UseGuards(GqlSellerAccessGuard)
  @Mutation(() => Product)
  updateProduct(
    @Args('productId', { type: () => ID }) productId: string,
    @Args('updateProductInput')
    updateProductInput: UpdateProductInput,
    @Args('updateProductOptionInput', { nullable: true })
    updateProductOptionInput: UpdateProductOptionInput,
    @CurrentUser() id: string,
  ): Promise<Product> {
    return this.productsService.update({
      productId,
      updateProductInput,
      updateProductOptionInput,
      id,
    });
  }

  @UseGuards(GqlSellerAccessGuard)
  @Mutation(() => Boolean)
  deleteProduct(
    @Args('productId', { type: () => ID }) productId: string, //
  ): Promise<boolean> {
    return this.productsService.delete({ productId });
  }
}
