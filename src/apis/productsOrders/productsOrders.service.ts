import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import setEndToLocal from 'src/commons/utils/setEndToLocal';
import { Repository } from 'typeorm';
import { CartService } from '../cart/cart.service';
import {
  Point,
  POINT_TRANSACTION_STATUS_ENUM,
} from '../points/entities/point.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import {
  ProductOrder,
  PRODUCT_ORDER_STATUS_ENUM,
} from './entities/productOrder.entity';

@Injectable()
export class ProductsOrdersService {
  constructor(
    @InjectRepository(ProductOrder)
    private readonly productsOrdersRepository: Repository<ProductOrder>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Point)
    private readonly pointsRepository: Repository<Point>,
    private readonly cartsService: CartService,
  ) {}

  async findAllByBuyer({ startDate, endDate, page, id }) {
    if ((startDate && !endDate) || (!startDate && endDate))
      throw new UnprocessableEntityException(
        '날짜 설정시 시작과 끝을 모두 지정해주세요.',
      );
    if (startDate && endDate) {
      const { endLocal } = setEndToLocal({ endDate });
      return await this.productsOrdersRepository
        .createQueryBuilder('productOrder')
        .leftJoinAndSelect('productOrder.buyer', 'buyer')
        .where('productOrder.buyer = :id', { id })
        .andWhere('productOrder.updatedAt BETWEEN :startDate AND :endLocal', {
          startDate,
          endLocal,
        })
        .orderBy('productOrder.updatedAt', 'DESC')
        .skip((page - 1) * 10)
        .take(10)
        .getMany();
    } else {
      return await this.productsOrdersRepository
        .createQueryBuilder('productOrder')
        .leftJoinAndSelect('productOrder.buyer', 'buyer')
        .where('productOrder.buyer = :id', { id })
        .orderBy('productOrder.updatedAt', 'DESC')
        .skip((page - 1) * 10)
        .take(10)
        .getMany();
    }
  }

  async findAllCountByBuyer({ startDate, endDate, id }) {
    if ((startDate && !endDate) || (!startDate && endDate))
      throw new UnprocessableEntityException(
        '날짜 설정시 시작과 끝을 모두 지정해주세요.',
      );
    if (startDate && endDate) {
      const { endLocal } = setEndToLocal({ endDate });
      return await this.productsOrdersRepository
        .createQueryBuilder('productOrder')
        .leftJoinAndSelect('productOrder.buyer', 'buyer')
        .where('productOrder.buyer = :id', { id })
        .andWhere('productOrder.updatedAt BETWEEN :startDate AND :endLocal', {
          startDate,
          endLocal,
        })
        .getCount();
    } else {
      return await this.productsOrdersRepository
        .createQueryBuilder('productOrder')
        .leftJoinAndSelect('productOrder.buyer', 'buyer')
        .where('productOrder.buyer = :id', { id })
        .getCount();
    }
  }

  async findAllBySeller({ startDate, endDate, page, id }) {
    if ((startDate && !endDate) || (!startDate && endDate))
      throw new UnprocessableEntityException(
        '날짜 설정시 시작과 끝을 모두 지정해주세요.',
      );
    if (startDate && endDate) {
      const { endLocal } = setEndToLocal({ endDate });
      return await this.productsOrdersRepository
        .createQueryBuilder('productOrder')
        .leftJoinAndSelect('productOrder.seller', 'seller')
        .where('productOrder.seller = :id', { id })
        .andWhere('productOrder.updatedAt BETWEEN :startDate AND :endLocal', {
          startDate,
          endLocal,
        })
        .orderBy('productOrder.updatedAt', 'DESC')
        .skip((page - 1) * 10)
        .take(10)
        .getMany();
    } else {
      return await this.productsOrdersRepository
        .createQueryBuilder('productOrder')
        .leftJoinAndSelect('productOrder.seller', 'seller')
        .where('productOrder.seller = :id', { id })
        .orderBy('productOrder.updatedAt', 'DESC')
        .skip((page - 1) * 10)
        .take(10)
        .getMany();
    }
  }

  async findAllCountBySeller({ startDate, endDate, id }) {
    if ((startDate && !endDate) || (!startDate && endDate))
      throw new UnprocessableEntityException(
        '날짜 설정시 시작과 끝을 모두 지정해주세요.',
      );
    if (startDate && endDate) {
      const { endLocal } = setEndToLocal({ endDate });
      return await this.productsOrdersRepository
        .createQueryBuilder('productOrder')
        .leftJoinAndSelect('productOrder.seller', 'seller')
        .where('productOrder.seller = :id', { id })
        .andWhere('productOrder.updatedAt BETWEEN :startDate AND :endLocal', {
          startDate,
          endLocal,
        })
        .getCount();
    } else {
      return await this.productsOrdersRepository
        .createQueryBuilder('productOrder')
        .leftJoinAndSelect('productOrder.seller', 'seller')
        .where('productOrder.seller = :id', { id })
        .getCount();
    }
  }

  async create({ productId, amount, quantity, id }) {
    const { product, buyer, seller } = await this.validateForPurchase({
      productId,
      amount,
      quantity,
      id,
    });

    const balanceOfBuyer = buyer.point - amount;
    const balanceOfSeller = seller.point + amount;

    await this.usersRepository.update({ id }, { point: balanceOfBuyer });

    await this.usersRepository.update(
      { id: seller.id },
      { point: balanceOfSeller },
    );

    await this.pointsRepository.save({
      amount: -amount,
      status: POINT_TRANSACTION_STATUS_ENUM.BOUGHT,
      balance: balanceOfBuyer,
      user: { id },
    });

    await this.pointsRepository.save({
      amount,
      status: POINT_TRANSACTION_STATUS_ENUM.SOLD,
      balance: balanceOfSeller,
      user: { id: seller.id },
    });

    await this.productsRepository.update(
      { id: productId },
      { quantity: product.quantity - quantity },
    );

    await this.cartsService.deleteBoughtFromCart({ productId, id });

    return await this.productsOrdersRepository.save({
      amount,
      quantity,
      status: PRODUCT_ORDER_STATUS_ENUM.BOUGHT,
      buyer: { id },
      seller: { id: seller.id },
      product: { id: productId },
    });
  }

  async validateForPurchase({ productId, amount, quantity, id }) {
    const target = await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['user'],
    });

    if (!target)
      throw new UnprocessableEntityException('존재하지 않는 상품입니다.');

    if (target.quantity < quantity)
      throw new UnprocessableEntityException('상품 재고가 부족합니다.');

    const user = await this.usersRepository.findOne({ where: { id } });

    if (user.point < amount)
      throw new UnprocessableEntityException(
        '포인트 충전 구매를 진행해주세요.',
      );

    return { product: target, buyer: user, seller: target.user };
  }

  async cancelOrder({ productOrderId, id }) {
    const { productOrder, seller, buyer } = await this.validateForCancel({
      productOrderId,
      id,
    });

    const balanceOfBuyer = buyer.point + productOrder.amount;
    const balanceOfSeller = seller.point - productOrder.amount;

    await this.usersRepository.update({ id }, { point: balanceOfBuyer });

    await this.usersRepository.update(
      { id: seller.id },
      { point: balanceOfSeller },
    );

    await this.pointsRepository.save({
      amount: productOrder.amount,
      status: POINT_TRANSACTION_STATUS_ENUM.REFUNDED,
      balance: balanceOfBuyer,
      user: { id },
    });

    await this.pointsRepository.save({
      amount: -productOrder.amount,
      status: POINT_TRANSACTION_STATUS_ENUM.COLLECTED,
      balance: balanceOfSeller,
      user: { id: seller.id },
    });

    await this.productsRepository.update(
      { id: productOrder.product.id },
      { quantity: productOrder.product.quantity + productOrder.quantity },
    );

    const result = await this.productsOrdersRepository.update(
      { id: productOrderId },
      { status: PRODUCT_ORDER_STATUS_ENUM.REFUNDED },
    );

    return result.affected ? true : false;
  }

  async validateForCancel({ productOrderId, id }) {
    const target = await this.productsOrdersRepository.findOne({
      where: { id: productOrderId },
      relations: ['buyer', 'product', 'seller'],
    });

    if (!target)
      throw new UnprocessableEntityException('존재하지 않는 구매건입니다.');

    if (target.buyer.id !== id)
      throw new UnprocessableEntityException('존재하지 않는 구매건입니다.');

    if (target.status === 'REFUNDED')
      throw new UnprocessableEntityException('이미 쥐소된 구매건입니다.');

    return { productOrder: target, seller: target.seller, buyer: target.buyer };
  }
}
