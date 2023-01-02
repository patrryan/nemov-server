import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
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

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  ///-----------------------------///
  async findAll({ category, page }) {
    return this.productsRepository
      .createQueryBuilder('product')
      .where('product.category = :category', { category })
      .orderBy('product.createdAt', 'DESC')
      .skip((page - 1) * 9)
      .take(9)
      .getMany();
  }

  ///-----------------------------///
  findOne({ productId }: IProductsServiceFindOne): Promise<Product> {
    return this.productsRepository.findOne({
      where: { id: productId },
    });
  }
  ///-----------------------------///

  async findCount({ category }) {
    return this.productsRepository
      .createQueryBuilder('product')
      .where('product.category = :category', { category })
      .getCount();
  }

  ///-----------------------------///
  async findProductBySeller({ id, page }) {
    return this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.user', 'user')
      .where('user = :user', { id })
      .orderBy('product.createdAt', 'DESC')
      .skip((page - 1) * 9)
      .take(10)
      .getMany();
  }
  ///-----------------------------///
  async create({
    createProductInput,
    id,
  }: IProductsServiceCreate): Promise<Product> {
    const user = await this.usersRepository.findOne({
      where: {
        id: id,
      },
    });
    console.log(user);
    return await this.productsRepository.save({
      ...createProductInput,
      user: { ...user },
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
