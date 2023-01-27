import { CreateProductCategoryInput } from '../dto/create-product.input';
import { UpdateProductCategoryInput } from '../dto/update-product.input';

export interface IProductsCategoriesServiceCreate {
  createProductCategoryInput: CreateProductCategoryInput;
}

export interface IProductsServiceFindOne {
  productCategoryId: string;
}

export interface IProductsCategoryServiceDelete {
  productCategoryId: string;
}

export interface IProductsCategoriesServiceUpdate {
  productCategoryId: string;
  updateProductCategoryInput: UpdateProductCategoryInput;
}
