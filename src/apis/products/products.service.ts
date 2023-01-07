import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from '../productsCategories/entities/productCategory.entity';
import { ProductOption } from '../productsOptions/entities/productOption.entity';
import { ProductOptionService } from '../productsOptions/productsOptions.service';
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
    private readonly productOptionService: ProductOptionService,
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
        .leftJoinAndSelect('product.productOption', 'productOption')
        .where('product.veganLevel BETWEEN :veganLevel AND :end', {
          veganLevel,
          end: 8,
        })
        .getCount();
    }
    return this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.productOption', 'productOption')
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

  async findProductBySeller({ id, page }) {
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
      .where('productOrder.status = :status', { status: 'BOUGHT' })
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
    const { productCategoryId, ...rest } = createProductInput;
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    const productCategory = await this.productsCategoriesRepository.findOne({
      where: { id: productCategoryId },
    });

    if (!productCategory) {
      throw new UnprocessableEntityException('존재하지 않는 카테고리입니다.');
    }

    const savedOption: ProductOption =
      await this.productOptionService.createOption({
        productId: id,
        ...createProductOptionInput,
      });

    return await this.productsRepository.save({
      ...rest,
      user: { ...user },
      productCategory: { ...productCategory },
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
      relations: ['productCategory', 'user'],
    });

    if (!target)
      throw new UnprocessableEntityException('존재하지 않는 상품입니다.');

    if (target.user.id !== id)
      throw new UnprocessableEntityException('상품을 수정할 권한이 없습니다.');

    const { productCategoryId, ...rest } = updateProductInput;

    let changedCategory = {};

    if (productCategoryId) {
      changedCategory = await this.productsCategoriesRepository.findOne({
        where: { id: productCategoryId },
      });

      if (changedCategory)
        throw new UnprocessableEntityException('존재하지 않는 카테고리입니다.');
    }

    const newProductOption = await this.productOptionService.updateOption({
      productId,
      ...updateProductOptionInput,
    });

    return await this.productsRepository.save({
      ...target,
      ...rest,
      productCategory: { ...target.productCategory, ...changedCategory },
    });
  }

  async delete({ productId }: IProductsServiceDelete): Promise<boolean> {
    const result = await this.productsRepository.delete({ id: productId });
    return result.affected ? true : false;
  }
}
