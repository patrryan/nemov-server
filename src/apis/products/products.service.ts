import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

// import { Payment} from '../payment/entities/payment.entity'
import {
  IProductsServiceCreate,
  IProductsServiceDelete,
  IProductsServiceFindOne,
  IProductsServiceUpdate,
} from './interfaces/products-service.interface';
// import { ProductAllergy } from '../productsAllergy/productAllergy.entity';
// import { ProductCategory } from '../productsCategory/entities/productCategory.entity';
// import { ProductImage } from '../productsImage/entities/productImage.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>, // // @InjectRepository(Payment) // private readonly paymentRepository: Repository<Payment>, // // @InjectRepository(ProductAllergy) // private readonly ProductAllergyRepository: Repository<ProductAllergy>, //  ???? // @InjectRepository(ProductCategory) // private readonly ProductCategoryRepository: Repository<ProductCategory>, // @InjectRepository(ProductImage) // private readonly ProductImageRepository: Repository<ProductImage>,
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
      // relations: ['productCategory', 'productAllergy'],
    });
  }

  async create({
    createProductInput,
  }: IProductsServiceCreate): Promise<Product> {
    const result3 = await this.productsRepository.save({
      ...createProductInput,
    });
    return result3;
  }

  ///-----------------------------///

  async update({
    product,
    updateProductInput,
  }: IProductsServiceUpdate): Promise<Product> {
    const result = this.productsRepository.save({
      ...product,
      ...updateProductInput,
    });

    return result;
  }

  async delete({ productId }: IProductsServiceDelete): Promise<boolean> {
    const result = await this.productsRepository.delete({ id: productId });
    return result.affected ? true : false;
  }
}
