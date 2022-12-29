import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from '../Images/entities/Image.entity';
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
    @InjectRepository(Image)
    private readonly imagesRepository: Repository<Image>,
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
      relations: ['image'],
    });
  }

  async create({
    createProductInput,
  }: IProductsServiceCreate): Promise<Product> {
    const { image, ...rest } = createProductInput;

    const result = await this.imagesRepository.save({ url: image });

    return await this.productsRepository.save({
      ...rest,
      image: { ...result },
    });
  }

  ///-----------------------------///

  async update({
    product,
    updateProductInput,
  }: IProductsServiceUpdate): Promise<Product> {
    const { image, ...rest } = updateProductInput;

    let newImage = {};

    if (image) {
      newImage = await this.imagesRepository.save({
        ...product.image,
        url: image,
      });
    }

    return await this.productsRepository.save({
      ...product,
      ...rest,
      image: { ...product.image, ...newImage },
    });
  }

  async delete({ productId }: IProductsServiceDelete): Promise<boolean> {
    const result = await this.productsRepository.delete({ id: productId });
    return result.affected ? true : false;
  }
}
