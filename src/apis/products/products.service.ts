import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import {
  IProductsServiceCreate,
  IProductsServiceDelete,
  IProductsServiceFindOne,
  IProductsServiceUpdate,
} from './interfaces/products-service.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  ///-----------------------------///
  findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      // relations: ['productCategory', 'productAllergy'],
    });
  }

  ///-----------------------------///
  findOne({ productId }: IProductsServiceFindOne): Promise<Product> {
    return this.productsRepository.findOne({
      where: { id: productId },
    });
  }
  ///-----------------------------///

  async findCount() {
    return await this.productsRepository.count();
  }

  ///-----------------------------///
  async findProductBySeller({ sellerId, page }) {
    return this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.user', 'user')
      .where('seller.id = :sellerId', { sellerId })
      .orderBy('product.createdAt', 'DESC')
      .skip((page - 1) * 10)
      .take(10)
      .getMany();
  }
  ///-----------------------------///
  async create({
    createProductInput,
  }: IProductsServiceCreate): Promise<Product> {
    return await this.productsRepository.save({
      ...createProductInput,
    });
  }

  ///-----------------------------///

  async update({
    product,
    updateProductInput,
  }: IProductsServiceUpdate): Promise<Product> {
    return await this.productsRepository.save({
      ...product,
      ...updateProductInput,
    });
  }

  ///-----------------------------///

  async delete({ productId }: IProductsServiceDelete): Promise<boolean> {
    const result = await this.productsRepository.delete({ id: productId });
    return result.affected ? true : false;
  }
}
