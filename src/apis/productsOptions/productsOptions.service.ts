import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductOption } from './entities/productOption.entity';

@Injectable()
export class ProductOptionService {
  constructor(
    @InjectRepository(ProductOption)
    private readonly productOptionsRepository: Repository<ProductOption>,
  ) {}

  async findOption({ productId }) {
    //LOGGING
    console.log(new Date(), ' | ProductOptionService.findOption()');

    return await this.productOptionsRepository
      .createQueryBuilder('productOption')
      .where('productOption.product = :productId', { productId })
      .getOne();
  }

  async createOption({ productId, ...rest }) {
    //LOGGING
    console.log(new Date(), ' | ProductOptionService.createOption()');

    const productOption = this.productOptionsRepository.create({
      product: { id: productId },
      ...rest,
    });

    return await this.productOptionsRepository.save(productOption);
  }

  async updateOption({ productId, ...rest }) {
    //LOGGING
    console.log(new Date(), ' | ProductOptionService.updateOption()');

    const productOption = await this.findOption({ productId });

    if (!productOption) {
      throw new UnprocessableEntityException('Product option not found');
    }

    const updatedProductOption = this.productOptionsRepository.merge(
      productOption,
      rest,
    );

    return await this.productOptionsRepository.save(updatedProductOption);
  }

  async deleteOption({ productId }) {
    //LOGGING
    console.log(new Date(), ' | ProductOptionService.deleteOption()');

    const productOption = await this.findOption({ productId });

    if (!productOption) {
      throw new UnprocessableEntityException('Product option not found');
    }

    return await this.productOptionsRepository.remove(productOption);
  }
}
