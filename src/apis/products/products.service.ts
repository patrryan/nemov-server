import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from '../productsCategories/entities/productCategory.entity';
import { ProductOption } from '../productsOptions/entities/productOption.entity';
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
    @InjectRepository(ProductOption)
    private readonly productsOptionsRepository: Repository<ProductOption>,
    @InjectRepository(ProductCategory)
    private readonly productsCategoriesRepository: Repository<ProductCategory>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll({ productCategoryId, page, veganLevel }) {
    const productCategory = await this.productsCategoriesRepository.findOne({
      where: { id: productCategoryId },
    });
    if (productCategory.name === '전체') {
      return await this.productsRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.user', 'user')
        .leftJoinAndSelect('product.productCategory', 'productCategory')
        .leftJoinAndSelect('product.productOption', 'productOption')
        .where('product.veganLevel BETWEEN :veganLevel AND :end', {
          veganLevel,
          end: 8,
        })
        .orderBy('product.createdAt', 'DESC')
        .skip((page - 1) * 9)
        .take(9)
        .getMany();
    }
    return await this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.user', 'user')
      .leftJoinAndSelect('product.productCategory', 'productCategory')
      .leftJoinAndSelect('product.productOption', 'productOption')
      .where('product.productCategory = :categoryId', {
        categoryId: productCategoryId,
      })
      .andWhere('product.veganLevel BETWEEN :veganLevel AND :end', {
        veganLevel,
        end: 8,
      })
      .orderBy('product.createdAt', 'DESC')
      .skip((page - 1) * 9)
      .take(9)
      .getMany();
  }

  async findCount({ productCategoryId, veganLevel }) {
    const productCategory = await this.productsCategoriesRepository.findOne({
      where: { id: productCategoryId },
    });
    if (productCategory.name === '전체') {
      return await this.productsRepository
        .createQueryBuilder('product')
        .where('product.veganLevel BETWEEN :veganLevel AND :end', {
          veganLevel,
          end: 8,
        })
        .getCount();
    }
    return this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.category = :categoryId', {
        categoryId: productCategoryId,
      })
      .andWhere('product.veganLevel BETWEEN :veganLevel AND :end', {
        veganLevel,
        end: 8,
      })
      .getCount();
  }

  async findOne({ productId }: IProductsServiceFindOne): Promise<Product> {
    return await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['user', 'productCategory', 'productOption'],
    });
  }

  async findAllBySeller({ id, page }) {
    return await this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.user', 'user')
      .leftJoinAndSelect('product.productCategory', 'productCategory')
      .where('product.user = :id', { id })
      .orderBy('product.createdAt', 'DESC')
      .skip((page - 1) * 9)
      .take(9)
      .getMany();
  }

  async findAllCountBySeller({ id }) {
    return await this.productsRepository
      .createQueryBuilder('product')
      .where('product.user = :id', { id })
      .getCount();
  }

  async findByRecommend() {
    const result = await this.productsRepository
      .createQueryBuilder('product')
      .where('product.isOutOfStock = :isOutOfStock', { isOutOfStock: false })
      .select('product.id')
      .addSelect('count(review.id)', 'countReview')
      .leftJoin('product.reviews', 'review')
      .groupBy('product.id')
      .orderBy('countReview', 'DESC')
      .take(3)
      .getMany();

    return await Promise.all(
      result.map((el) => {
        return new Promise<Product>(async (resolve, reject) => {
          try {
            const product = await this.productsRepository.findOne({
              where: { id: el.id },
              relations: ['productCategory'],
            });
            resolve(product);
          } catch (error) {
            reject('');
          }
        });
      }),
    );
  }

  async findBySelling() {
    const result = await this.productsRepository
      .createQueryBuilder('product')
      .leftJoin('product.productOrder', 'productOrder')
      .where('product.isOutOfStock = :isOutOfStock', { isOutOfStock: false })
      .andWhere('productOrder.status = :status', { status: 'BOUGHT' })
      .select('product.id')
      .addSelect('count(productOrder.id)', 'countOrder')
      .groupBy('product.id')
      .orderBy('countOrder', 'DESC')
      .take(8)
      .getMany();

    return await Promise.all(
      result.map((el) => {
        return new Promise<Product>(async (resolve, reject) => {
          try {
            const product = await this.productsRepository.findOne({
              where: { id: el.id },
              relations: ['productCategory'],
            });
            resolve(product);
          } catch (error) {
            reject('');
          }
        });
      }),
    );
  }

  async create({
    createProductInput,
    createProductOptionInput,
    id,
  }: IProductsServiceCreate): Promise<Product> {
    const { productCategoryId, quantity, discountRate, price, ...rest } =
      createProductInput;

    const productCategory = await this.productsCategoriesRepository.findOne({
      where: { id: productCategoryId },
    });

    if (!productCategory) {
      throw new UnprocessableEntityException('존재하지 않는 카테고리입니다.');
    }

    let productOption = null;

    if (productCategory.name === '뷰티') {
      productOption = await this.productsOptionsRepository.save({
        ...createProductOptionInput,
      });
    }

    const discountedPrice = Math.ceil((price * (100 - discountRate)) / 100);

    let isOutOfStock = false;

    if (!quantity) {
      isOutOfStock = true;
    }

    return await this.productsRepository.save({
      ...rest,
      quantity,
      isOutOfStock,
      price,
      discountRate,
      discountedPrice,
      user: { id },
      productCategory: { ...productCategory },
      productOption,
    });
  }

  async update({
    productId,
    updateProductInput,
    updateProductOptionInput,
    id,
  }: IProductsServiceUpdate): Promise<Product> {
    const target = await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['productCategory', 'user', 'productOption'],
    });

    if (!target)
      throw new UnprocessableEntityException('존재하지 않는 상품입니다.');

    if (target.user.id !== id)
      throw new UnprocessableEntityException('상품을 수정할 권한이 없습니다.');

    const { quantity, discountRate, price, ...rest } = updateProductInput;

    let newQuantity = target.quantity;

    let newIsOutOfStock = target.isOutOfStock;

    if (quantity === 0) {
      newQuantity = 0;
      newIsOutOfStock = true;
    } else if (quantity > 0) {
      newQuantity = quantity;
      newIsOutOfStock = false;
    }

    const newDiscount = discountRate ? discountRate : target.discountRate;

    const newPrice = price ? price : target.price;

    const newDiscountedPrice = Math.ceil(
      (newPrice * (100 - newDiscount)) / 100,
    );

    let newProductOption = {};

    if (target.productCategory.name === '뷰티' && updateProductOptionInput) {
      newProductOption = await this.productsOptionsRepository.save({
        ...target.productOption,
        ...updateProductOptionInput,
      });
    }

    return await this.productsRepository.save({
      ...target,
      ...rest,
      price: newPrice,
      discountRate: newDiscount,
      discountedPrice: newDiscountedPrice,
      quantity: newQuantity,
      isOutOfStock: newIsOutOfStock,
      productOption: { ...target.productOption, ...newProductOption },
    });
  }

  async delete({ productId }: IProductsServiceDelete): Promise<boolean> {
    const result = await this.productsRepository.delete({ id: productId });
    return result.affected ? true : false;
  }
}
