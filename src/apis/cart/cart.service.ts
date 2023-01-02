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
import {
  ICartServiceCreate,
  ICartServiceFindAll,
  ICartServiceFindOne,
} from './interfaces/cart-service.interface';

@Injectable()
export class CartService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async findAll({ id }: ICartServiceFindAll): Promise<Product[]> {
    const target = await this.cacheManager.get(`${id}-basket`);
    if (!target) return [];

    if (typeof target === 'string') {
      const cart: string[] = JSON.parse(target);
      if (!cart.length) {
        return [];
      }
      return await Promise.all(
        cart.map((el) => {
          return new Promise<Product>(async (resolve, reject) => {
            try {
              const product = await this.productsRepository.findOne({
                where: { id: el },
              });
              resolve(product);
            } catch (error) {
              reject('');
            }
          });
        }),
      );
    }
  }

  async findOne({ productId, id }: ICartServiceFindOne): Promise<boolean> {
    const result = await this.cacheManager.get(`${id}-basket`);
    if (!result) return false;
    if (typeof result === 'string') {
      const cart: string[] = JSON.parse(result);
      return cart.includes(productId);
    }
  }

  async create({ productId, id }: ICartServiceCreate): Promise<boolean> {
    const result = await this.cacheManager.get(`${id}-basket`);
    if (!result) {
      const cart = [productId];
      await this.cacheManager.set(`${id}-basket`, JSON.stringify(cart), {
        ttl: 0,
      });
      return true;
    }
    if (typeof result === 'string') {
      const cart = JSON.parse(result);
      if (cart.includes(productId)) {
        cart.splice(cart.indexOf(productId), 1);
        await this.cacheManager.set(`${id}-basket`, JSON.stringify(cart), {
          ttl: 0,
        });
        return false;
      } else {
        if (cart.length === 10)
          throw new UnprocessableEntityException('장바구니가 가득 찼습니다.');
        cart.push(productId);
        await this.cacheManager.set(`${id}-basket`, JSON.stringify(cart), {
          ttl: 0,
        });
        return true;
      }
    }
  }
}
