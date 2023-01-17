import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { CartOutput } from './dto/cart.ouput';
import * as I from './interfaces/cart-service.interface';

@Injectable()
export class CartService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async findAll({ id }: I.CartServiceFindAll): Promise<Product[]> {
    const target = await this.cacheManager.get(`${id}-basket`);
    if (!target) return [];

    if (typeof target === 'string') {
      const cart = JSON.parse(target);
      if (!cart.length) {
        return [];
      }
      return await Promise.all(
        cart.map((el) => {
          return new Promise<CartOutput>(async (resolve, reject) => {
            try {
              const product = await this.productsRepository.findOne({
                where: { id: el.productId },
                relations: ['user', 'productCategory'],
              });
              resolve({ product, count: el.count });
            } catch (error) {
              reject('');
            }
          });
        }),
      );
    }
  }

  async findAllCount({ id }: I.CartServiceFindAllCount) {
    const result = await this.findAll({ id });

    return result.length;
  }

  async findOne({ productId, id }: I.CartServiceFindOne): Promise<boolean> {
    const result = await this.cacheManager.get(`${id}-basket`);
    if (!result) return false;
    if (typeof result === 'string') {
      const cart = JSON.parse(result);
      return cart.find((el) => el.productId === productId) ? true : false;
    }
  }

  async create({
    productId,
    count,
    id,
  }: I.CartServiceCreate): Promise<boolean> {
    const target = await this.productsRepository.findOne({
      where: { id: productId },
    });

    if (!target)
      throw new UnprocessableEntityException('존재하지 않는 상품입니다.');

    if (target.isOutOfStock)
      throw new UnprocessableEntityException('품절된 상품입니다.');

    const result = await this.cacheManager.get(`${id}-basket`);
    if (!result) {
      if (!count)
        throw new UnprocessableEntityException(
          '상품 수량을 선택한 후에 진행해주세요.',
        );
      const cart = [{ productId, count }];
      await this.cacheManager.set(`${id}-basket`, JSON.stringify(cart), {
        ttl: 1209600,
      });
      return true;
    }
    if (typeof result === 'string') {
      if (!count)
        throw new UnprocessableEntityException(
          '상품 수량을 선택한 후에 진행해주세요.',
        );
      const cart = JSON.parse(result);
      if (cart.find((el) => el.productId === productId)) {
        cart.splice(
          cart.findIndex((el) => el.productId === productId),
          1,
        );
        await this.cacheManager.set(`${id}-basket`, JSON.stringify(cart), {
          ttl: 1209600,
        });
        return false;
      } else {
        if (cart.length >= 15)
          throw new UnprocessableEntityException('장바구니가 가득 찼습니다.');
        cart.push({ productId, count });
        await this.cacheManager.set(`${id}-basket`, JSON.stringify(cart), {
          ttl: 1209600,
        });
        return true;
      }
    }
  }

  async deleteBoughtFromCart({ productId, id }: I.CartServiceDelete) {
    const result = await this.cacheManager.get(`${id}-basket`);
    if (typeof result === 'string') {
      const cart = JSON.parse(result);
      if (cart.find((el) => el.productId === productId)) {
        cart.splice(
          cart.findIndex((el) => el.productId === productId),
          1,
        );
        await this.cacheManager.set(`${id}-basket`, JSON.stringify(cart), {
          ttl: 1209600,
        });
      }
    }
  }
}
