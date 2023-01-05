import { Injectable, UnprocessableEntityException } from '@nestjs/common';
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

  findAll(): Promise<ProductCategory[]> {
    return this.productsCategoriesRepository.find();
  }

  findOne({
    productCategoryId,
  }: IProductsServiceFindOne): Promise<ProductCategory> {
    return this.productsCategoriesRepository.findOne({
      where: { id: productCategoryId },
    });
  }

  create({
    createProductCategoryInput,
  }: IProductsCategoriesServiceCreate): Promise<ProductCategory> {
    const result = this.productsCategoriesRepository.save({
      ...createProductCategoryInput,
    });

    return result;
  }

  async update({
    productCategoryId,
    updateProductCategoryInput,
  }: IProductsCategoriesServiceUpdate): Promise<ProductCategory> {
    const productCategory = await this.productsCategoriesRepository.findOne({
      where: { id: productCategoryId },
    });

    if (!productCategory)
      throw new UnprocessableEntityException('존재하지 않는 카테고리입니다.');

    return await this.productsCategoriesRepository.save({
      ...productCategory,
      ...updateProductCategoryInput,
    });
  }

  async delete({
    productCategoryId,
  }: IProductsCategoryServiceDelete): Promise<boolean> {
    const result = await this.productsCategoriesRepository.delete({
      id: productCategoryId,
    });
    return result.affected ? true : false;
  }
}
