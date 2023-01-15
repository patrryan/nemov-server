import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from '../productsCategories/entities/productCategory.entity';
import { ProductOption } from '../productsOptions/entities/productOption.entity';
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
  ) {}

  async findAll({ productCategoryId, veganLevel, search, page }) {
    const qb = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.user', 'user')
      .leftJoinAndSelect('product.productCategory', 'productCategory')
      .leftJoinAndSelect('product.productOption', 'productOption')
      .where('product.veganLevel BETWEEN :veganLevel AND :end', {
        veganLevel,
        end: 8,
      })
      .andWhere('product.productCategory IS NOT NULL');

    if (!productCategoryId && !search) {
      return await qb
        .orderBy('product.createdAt', 'DESC')
        .skip((page - 1) * 9)
        .take(9)
        .getMany();
    } else if (productCategoryId && search) {
      return await qb
        .andWhere('product.productCategory = :categoryId', {
          categoryId: productCategoryId,
        })
        .andWhere('product.name like :name', { name: `%${search}%` })
        .orderBy('product.createdAt', 'DESC')
        .skip((page - 1) * 9)
        .take(9)
        .getMany();
    } else if (productCategoryId) {
      return await qb
        .andWhere('product.productCategory = :categoryId', {
          categoryId: productCategoryId,
        })
        .orderBy('product.createdAt', 'DESC')
        .skip((page - 1) * 9)
        .take(9)
        .getMany();
    } else {
      return await qb
        .andWhere('product.name like :name', { name: `%${search}%` })
        .orderBy('product.createdAt', 'DESC')
        .skip((page - 1) * 9)
        .take(9)
        .getMany();
    }
  }

  async findCount({ productCategoryId, veganLevel, search }) {
    const qb = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.productCategory', 'productCategory')
      .where('product.veganLevel BETWEEN :veganLevel AND :end', {
        veganLevel,
        end: 8,
      })
      .andWhere('product.productCategory IS NOT NULL');

    if (!productCategoryId && !search) {
      return await qb.getCount();
    } else if (productCategoryId && search) {
      return await qb
        .andWhere('product.productCategory = :categoryId', {
          categoryId: productCategoryId,
        })
        .andWhere('product.name like :name', { name: `%${search}%` })
        .getCount();
    } else if (productCategoryId) {
      return await qb
        .andWhere('product.productCategory = :categoryId', {
          categoryId: productCategoryId,
        })
        .getCount();
    } else {
      return await qb
        .andWhere('product.name like :name', { name: `%${search}%` })
        .getCount();
    }
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
      .andWhere('product.productCategory IS NOT NULL')
      .orderBy('product.createdAt', 'DESC')
      .skip((page - 1) * 9)
      .take(9)
      .getMany();
  }

  async findAllCountBySeller({ id }) {
    return await this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.productCategory', 'productCategory')
      .where('product.user = :id', { id })
      .andWhere('product.productCategory IS NOT NULL')
      .getCount();
  }

  async findByRecommend() {
    const result = await this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.productCategory', 'productCategory')
      .where('product.isOutOfStock = :isOutOfStock', { isOutOfStock: false })
      .andWhere('product.productCategory IS NOT NULL')
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
      .leftJoinAndSelect('product.productCategory', 'productCategory')
      .leftJoin('product.productOrder', 'productOrder')
      .where('product.isOutOfStock = :isOutOfStock', { isOutOfStock: false })
      .andWhere('product.productCategory IS NOT NULL')
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

  async delete({ productId, id }: IProductsServiceDelete): Promise<boolean> {
    const target = await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['user'],
    });

    if (!target) {
      throw new UnprocessableEntityException('존재하지 않는 상품입니다.');
    }

    if (target.user.id !== id) {
      throw new UnprocessableEntityException('삭제할 권한이 없습니다.');
    }

    const result = await this.productsRepository.update(
      { id: productId },
      {
        name: `[삭제된 상품] ${target.name}`,
        description: `삭제`,
        veganLevel: null,
        quantity: 0,
        isOutOfStock: true,
        option1: null,
        option2: null,
        option3: null,
        option4: null,
        option5: null,
        productOption: null,
        productCategory: null,
      },
    );

    return result.affected ? true : false;
  }
}
