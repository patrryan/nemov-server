import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@Resolver()
export class ProductsResolver {
  constructor(
    private readonly productsService: ProductsService, //
  ) {}

  ///-----------------------------///

  @Query(() => [Product])
  fetchProducts(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  ///-----------------------------///

  @Query(() => Product)
  fetchProduct(
    @Args('productId') productId: string, //
  ): Promise<Product> {
    return this.productsService.findOne({ productId });
  }
  ///-----------------------------///

  @Query(() => Int)
  fetchProductsCount() {
    return this.productsService.findCount();
  }

  ///-----------------------------///

  @Query(() => [Product])
  async fetchProductsBySeller(
    @Args('sellerId') sellerId: string, //
    @Args({ name: 'page', type: () => Int }) page: number,
  ) {
    return await this.productsService.findProductBySeller({ sellerId, page });
  }

  ///-----------------------------///
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Product)
  createProduct(
    @Args('createProductInput')
    createProductInput: CreateProductInput,
  ): Promise<Product> {
    return this.productsService.create({ createProductInput });
  }

  ///-----------------------------///
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Product)
  async updateProduct(
    @Args('productId') productId: string,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    const product = await this.productsService.findOne({ productId });

    return this.productsService.update({ product, updateProductInput });
  }

  ///-----------------------------///
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteProduct(
    @Args('productId') productId: string, //
  ): Promise<boolean> {
    return this.productsService.delete({ productId });
  }

  ///-----------------------------///
}
