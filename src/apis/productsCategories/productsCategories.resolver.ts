import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Product } from '../products/entities/product.entity';
import { CreateProductCategoryInput } from './dto/create-product.input';
import { UpdateProductCategoryInput } from './dto/update-product.input';
import { ProductCategory } from './entities/productCategory.entity';
import { ProductsCategoriesService } from './productsCategories.service';

@Resolver()
export class ProductsCategoriesResolver {
  constructor(
    private readonly productsCategoriesService: ProductsCategoriesService, //
  ) {}

  //-------------------------------------

  @Query(() => [ProductCategory])
  fetchProductCategories(): Promise<ProductCategory[]> {
    return this.productsCategoriesService.findAll();
  }

  //-------------------------------------

  @Mutation(() => ProductCategory)
  createProductCategory(
    @Args('createProductCategoryInput')
    createProductCategoryInput: CreateProductCategoryInput,
  ): Promise<ProductCategory> {
    return this.productsCategoriesService.create({
      createProductCategoryInput,
    });
  }

  //-------------------------------------

  @Mutation(() => ProductCategory)
  async updateProduct(
    @Args('productCategoryId', { type: () => ID }) productCategoryId: string,
    @Args('updateProductCategoryInput')
    updateProductCategoryInput: UpdateProductCategoryInput,
  ): Promise<ProductCategory> {
    const productCategory = await this.productsCategoriesService.findOne({
      productCategoryId,
    });

    return this.productsCategoriesService.update({
      productCategory,
      updateProductCategoryInput,
    });
  }

  //-------------------------------------

  @Mutation(() => Boolean)
  deleteProductCategory(
    @Args('productId', { type: () => ID }) productCategoryId: string, //
  ): Promise<boolean> {
    return this.productsCategoriesService.delete({ productCategoryId });
  }
}
