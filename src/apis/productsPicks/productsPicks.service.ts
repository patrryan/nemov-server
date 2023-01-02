import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { ProductPick } from './entities/productPick.entity';
import {
  IProductsPicksServiceCreate,
  IProductsPicksServiceFindAllByUser,
  IProductsPicksServiceFindAllCountByUser,
  IProductsPicksServiceFindAllCountByProduct,
  IProductsPicksServiceFindOneByUser,
} from './interfaces/products-picks-service.interface';

@Injectable()
export class ProductsPicksService {
  constructor(
    @InjectRepository(ProductPick)
    private readonly productsPicksRepository: Repository<ProductPick>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async findAllByUser({
    page,
    id,
  }: IProductsPicksServiceFindAllByUser): Promise<Product[]> {
    const target = await this.productsPicksRepository
      .createQueryBuilder('productPick')
      .leftJoinAndSelect('productPick.product', 'product')
      .where('productPick.user = :id', { id })
      .orderBy('productPick.createdAt', 'DESC')
      .skip((page - 1) * 10)
      .take(10)
      .getMany();

    return await Promise.all(
      target.map((el) => {
        return new Promise<Product>(async (resolve, reject) => {
          try {
            const product = await this.productsRepository.findOne({
              where: { id: el.product.id },
            });
            resolve(product);
          } catch (error) {
            reject('');
          }
        });
      }),
    );
  }

  async findAllCountByUser({
    id,
  }: IProductsPicksServiceFindAllCountByUser): Promise<number> {
    return await this.productsPicksRepository
      .createQueryBuilder('productPick')
      .where('productPick.user = :id', { id })
      .getCount();
  }

  async findOneByUser({
    productId,
    id,
  }: IProductsPicksServiceFindOneByUser): Promise<boolean> {
    const target = await this.productsPicksRepository
      .createQueryBuilder('productPick')
      .where('productPick.user = :id', { id })
      .andWhere('productPick.product = :productId', { productId })
      .getOne();

    return target ? true : false;
  }

  async findAllCountByProduct({
    productId,
  }: IProductsPicksServiceFindAllCountByProduct): Promise<number> {
    return await this.productsPicksRepository
      .createQueryBuilder('productPick')
      .where('productPick.product = :productId', { productId })
      .getCount();
  }

  async create({
    productId,
    id,
  }: IProductsPicksServiceCreate): Promise<boolean> {
    const target = await this.productsPicksRepository
      .createQueryBuilder('productPick')
      .where('productPick.user = :id', { id })
      .andWhere('productPick.product = :productId', { productId })
      .getOne();

    if (target) {
      await this.productsPicksRepository.delete({ id: target.id });
      return false;
    } else {
      await this.productsPicksRepository.save({
        product: { id: productId },
        user: { id },
      });
      return true;
    }
  }
}
