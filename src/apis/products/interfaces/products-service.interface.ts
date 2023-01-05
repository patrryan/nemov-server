import { CreateProductInput } from '../dto/create-product.input';
import { UpdateProductInput } from '../dto/update-product.input';

export interface IProductsServiceCreate {
  createProductInput: CreateProductInput;
  id: string;
}

export interface IProductsServiceFindOne {
  productId: string;
}

export interface IProductsServiceUpdate {
  productId: string;
  updateProductInput: UpdateProductInput;
  id: string;
}

export interface IProductsServiceDelete {
  productId: string;
}

export interface IProductsServicewithDeleted {
  productId: string;
}
