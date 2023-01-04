import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from './entities/productCategory.entity';
import {
  IProductsCategoriesServiceCreate,
  IProductsCategoriesServiceUpdate,
  IProductsCategoryServiceDelete,
  IProductsServiceFindOne,
} from './interfaces/productscategories-service.interface';

@Injectable()
export class ProductsCategoriesService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly productsCategoriesRepository: Repository<ProductCategory>,
  ) {}

  //-------------------------------------

  findAll(): Promise<ProductCategory[]> {
    return this.productsCategoriesRepository.find();
  }

  //-------------------------------------

  findOne({
    productCategoryId,
  }: IProductsServiceFindOne): Promise<ProductCategory> {
    return this.productsCategoriesRepository.findOne({
      where: { id: productCategoryId },
    });
  }
  //-------------------------------------

  create({
    createProductCategoryInput,
  }: IProductsCategoriesServiceCreate): Promise<ProductCategory> {
    const result = this.productsCategoriesRepository.save({
      ...createProductCategoryInput,
    });

    return result;
  }

  //-------------------------------------

  async update({
    productCategory,
    updateProductCategoryInput,
  }: IProductsCategoriesServiceUpdate): Promise<ProductCategory> {
    return await this.productsCategoriesRepository.save({
      ...productCategory,
      ...updateProductCategoryInput,
    });
  }

  //-------------------------------------

  async delete({
    productCategoryId,
  }: IProductsCategoryServiceDelete): Promise<boolean> {
    const result = await this.productsCategoriesRepository.delete({
      id: productCategoryId,
    });
    return result.affected ? true : false;
  }
}
