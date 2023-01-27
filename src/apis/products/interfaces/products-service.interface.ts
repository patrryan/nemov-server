import { CreateProductOptionInput } from 'src/apis/productsOptions/dto/createProductOption.input';
import { UpdateProductOptionInput } from 'src/apis/productsOptions/dto/updateProductOption.input';
import { CreateProductInput } from '../dto/create-product.input';
import { UpdateProductInput } from '../dto/update-product.input';

export interface IProductsServiceCreate {
  createProductInput: CreateProductInput;
  createProductOptionInput: CreateProductOptionInput;
  id: string;
}

export interface IProductsServiceFindOne {
  productId: string;
}

export interface IProductsServiceUpdate {
  productId: string;
  updateProductInput: UpdateProductInput;
  updateProductOptionInput: UpdateProductOptionInput;
  id: string;
}

export interface IProductsServiceDelete {
  productId: string;
  id: string;
}

export interface IProductsServicewithDeleted {
  productId: string;
}
