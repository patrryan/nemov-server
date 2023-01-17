import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import setEndToLocal from 'src/commons/utils/setEndToLocal';
import { Brackets, Repository } from 'typeorm';
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
import { ReviewsService } from '../reviews/reviews.service';
import * as I from './interfaces/products-orders-service.interface';

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
    private readonly reviewsService: ReviewsService,
  ) {}

  async findAllByBuyer({
    startDate,
    endDate,
    page,
    id,
  }: I.FindAllByBuyer): Promise<ProductOrder[]> {
    if ((startDate && !endDate) || (!startDate && endDate))
      throw new UnprocessableEntityException(
        '날짜 설정시 시작과 끝을 모두 지정해주세요.',
      );
    if (startDate && endDate) {
      const { endLocal } = setEndToLocal({ endDate });
      return await this.productsOrdersRepository
        .createQueryBuilder('productOrder')
        .leftJoinAndSelect('productOrder.buyer', 'buyer')
        .leftJoinAndSelect('productOrder.product', 'product')
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
        .leftJoinAndSelect('productOrder.product', 'product')
        .where('productOrder.buyer = :id', { id })
        .orderBy('productOrder.updatedAt', 'DESC')
        .skip((page - 1) * 10)
        .take(10)
        .getMany();
    }
  }

  async findAllCountByBuyer({
    startDate,
    endDate,
    id,
  }: I.FindAllCountByBuyer): Promise<number> {
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

  async findAllCountOfBought({ id }: I.FindAllCountOfBought): Promise<number> {
    return await this.productsOrdersRepository
      .createQueryBuilder('productOrder')
      .where('productOrder.buyer = :id', { id })
      .andWhere('productOrder.status = :status', { status: 'BOUGHT' })
      .getCount();
  }

  async findAllBySeller({
    startDate,
    endDate,
    page,
    id,
  }: I.FindAllBySeller): Promise<ProductOrder[]> {
    if ((startDate && !endDate) || (!startDate && endDate))
      throw new UnprocessableEntityException(
        '날짜 설정시 시작과 끝을 모두 지정해주세요.',
      );
    if (startDate && endDate) {
      const { endLocal } = setEndToLocal({ endDate });
      return await this.productsOrdersRepository
        .createQueryBuilder('productOrder')
        .leftJoinAndSelect('productOrder.seller', 'seller')
        .leftJoinAndSelect('productOrder.product', 'product')
        .leftJoinAndSelect('productOrder.buyer', 'buyer')
        .leftJoinAndSelect('productOrder.review', 'review')
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
        .leftJoinAndSelect('productOrder.product', 'product')
        .leftJoinAndSelect('productOrder.buyer', 'buyer')
        .leftJoinAndSelect('productOrder.review', 'review')
        .where('productOrder.seller = :id', { id })
        .orderBy('productOrder.updatedAt', 'DESC')
        .skip((page - 1) * 10)
        .take(10)
        .getMany();
    }
  }

  async findAllCountBySeller({
    startDate,
    endDate,
    id,
  }: I.FindAllCountBySeller): Promise<number> {
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

  async findAllWithoutReview({
    page,
    id,
  }: I.FindAllWithoutReview): Promise<ProductOrder[]> {
    return await this.productsOrdersRepository
      .createQueryBuilder('productOrder')
      .leftJoinAndSelect('productOrder.product', 'product')
      .leftJoinAndSelect('productOrder.review', 'review')
      .leftJoinAndSelect('productOrder.seller', 'seller')
      .where('productOrder.buyer = :id', { id })
      .andWhere('productOrder.status = :status', { status: 'BOUGHT' })
      .andWhere('productOrder.review IS NULL')
      .orderBy('productOrder.createdAt', 'DESC')
      .skip((page - 1) * 10)
      .take(10)
      .getMany();
  }

  async findAllCountWithoutReview({
    id,
  }: I.FindAllCountWithoutReview): Promise<number> {
    return await this.productsOrdersRepository
      .createQueryBuilder('productOrder')
      .where('productOrder.buyer = :id', { id })
      .andWhere('productOrder.status = :status', { status: 'BOUGHT' })
      .andWhere('productOrder.review IS NULL')
      .getCount();
  }

  async verifyForPurchase({ productOrders, amount, id }: I.VerifyForPurchase) {
    const result = await this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.user', 'user')
      .where(
        new Brackets((qb) => {
          for (let i = 0; i < productOrders.length; i++) {
            qb.orWhere(
              `product.id = :id${i} AND product.quantity >= :quantity${i}`,
              {
                [`id${i}`]: productOrders[i].productId,
                [`quantity${i}`]: productOrders[i].quantity,
              },
            );
          }
        }),
      )
      .andWhere('product.isOutOfStock = :isOutOfStock', { isOutOfStock: false })
      .select([
        'product.id',
        'product.discountedPrice',
        'product.quantity',
        'user.id',
        'user.point',
      ])
      .getMany();

    console.log(productOrders);
    console.log(result);

    if (productOrders.length !== result.length) {
      throw new UnprocessableEntityException('다시 결제를 진행해주세요.');
    }

    console.log('111111111111111');

    const productToBuy = result.map((el, i) => {
      return { ...el, count: productOrders[i].quantity };
    });

    const verifiedAmount = productToBuy.reduce((acc, cur) => {
      const each = cur.discountedPrice * cur.count;
      return acc + each;
    }, 0);

    console.log('2222222222222222');

    if (
      (verifiedAmount < 50000 && verifiedAmount + 3000 !== amount) ||
      (verifiedAmount >= 50000 && verifiedAmount !== amount)
    ) {
      throw new UnprocessableEntityException('다시 결제를 진행해주세요.');
    }

    console.log('33333333333333333');

    const buyer = await this.usersRepository.findOne({ where: { id } });

    if (buyer.point < amount) {
      throw new UnprocessableEntityException(
        '포인트 충전 후 결제를 진행해주세요.',
      );
    }

    console.log('4444444444444444444');

    return { productToBuy, buyer };
  }

  async create({ productOrders, amount, id }: I.Create): Promise<string> {
    const { productToBuy, buyer } = await this.verifyForPurchase({
      productOrders,
      amount,
      id,
    });

    for (let i = 0; i < productToBuy.length; i++) {
      await this.createProductOrder({ productToBuy: productToBuy[i], buyer });
    }

    await this.pointsRepository.save({
      amount: -amount,
      status: POINT_TRANSACTION_STATUS_ENUM.BOUGHT,
      balance: buyer.point - amount,
      user: { id: buyer.id },
    });

    await this.usersRepository.update(
      { id: buyer.id },
      { point: buyer.point - amount },
    );

    return '결제 완료';
  }

  async createProductOrder({
    productToBuy,
    buyer,
  }: I.CreateProductOrder): Promise<ProductOrder> {
    const { id, discountedPrice, quantity, user, count } = productToBuy;
    const amount = discountedPrice * count;
    const balanceOfSeller = user.point + amount;

    await this.usersRepository.update(
      { id: user.id },
      { point: balanceOfSeller },
    );

    await this.pointsRepository.save({
      amount,
      status: POINT_TRANSACTION_STATUS_ENUM.SOLD,
      balance: balanceOfSeller,
      user: { id: user.id },
    });

    if (quantity - count === 0) {
      await this.productsRepository.update(
        { id },
        { quantity: 0, isOutOfStock: true },
      );
    } else {
      await this.productsRepository.update(
        { id },
        { quantity: quantity - count },
      );
    }

    await this.cartsService.deleteBoughtFromCart({
      productId: id,
      id: buyer.id,
    });

    return await this.productsOrdersRepository.save({
      amount,
      quantity: count,
      status: PRODUCT_ORDER_STATUS_ENUM.BOUGHT,
      buyer,
      seller: { id: user.id },
      product: { id },
    });
  }

  async cancelOrder({ productOrderId, id }: I.CancelOrder) {
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
      {
        quantity: productOrder.product.quantity + productOrder.quantity,
        isOutOfStock: false,
      },
    );

    if (productOrder.review) {
      await this.reviewsService.delete({
        reviewId: productOrder.review.id,
        id,
      });
    }

    const result = await this.productsOrdersRepository.update(
      { id: productOrderId },
      { status: PRODUCT_ORDER_STATUS_ENUM.REFUNDED },
    );

    return result.affected ? true : false;
  }

  async validateForCancel({ productOrderId, id }: I.ValidateForCancel) {
    const target = await this.productsOrdersRepository.findOne({
      where: { id: productOrderId },
      relations: ['buyer', 'product', 'seller', 'review'],
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
