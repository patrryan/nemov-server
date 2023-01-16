import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductOrder } from '../productsOrders/entities/productOrder.entity';
import { Review } from './entities/review.entity';
import {
  IReviewsServiceCreate,
  IReviewsServiceDelete,
  IReviewsServiceFindReview,
  IReviewsServiceUpdate,
} from './interfaces/reviews.service.interface';

Injectable();
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    @InjectRepository(ProductOrder)
    private readonly productsOrdersRepository: Repository<ProductOrder>,
  ) {}

  async findAllByProduct({ productId, page }) {
    return await this.reviewsRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .where('review.product = :productId', { productId })
      .andWhere('review.user.email IS NOT NULL')
      .orderBy('review.createdAt', 'DESC')
      .skip((page - 1) * 10)
      .take(10)
      .getMany();
  }

  async findAllCountByProduct({ productId }) {
    return await this.reviewsRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .where('review.product = :productId', { productId })
      .andWhere('user.email IS NOT NULL')
      .getCount();
  }

  async findAllByBuyer({ page, id }) {
    return await this.reviewsRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.product', 'product')
      .leftJoinAndSelect('product.user', 'user')
      .where('review.user = :id', { id })
      .orderBy('review.createdAt', 'DESC')
      .skip((page - 1) * 10)
      .take(10)
      .getMany();
  }

  async findAllCountByBuyer({ id }) {
    return await this.reviewsRepository
      .createQueryBuilder('review')
      .where('review.user = :id', { id })
      .getCount();
  }

  async findOne({ id }: IReviewsServiceFindReview): Promise<Review> {
    return await this.reviewsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async create({
    productOrderId,
    createReviewInput,
    id,
  }: IReviewsServiceCreate): Promise<Review> {
    const target = await this.productsOrdersRepository.findOne({
      where: { id: productOrderId },
      relations: ['buyer', 'product'],
    });

    if (!target)
      throw new UnprocessableEntityException('존재하지 않는 상품결제건입니다.');

    if (target.buyer.id !== id)
      throw new UnprocessableEntityException(
        '구매하지 않은 상품 결제건입니다.',
      );

    const result = await this.reviewsRepository.save({
      ...createReviewInput,
      product: { id: target.product.id },
      user: { id },
    });

    await this.productsOrdersRepository.update(
      { id: productOrderId },
      { review: { id: result.id } },
    );

    return result;
  }

  async update({
    reviewId,
    updateReviewInput,
    id,
  }: IReviewsServiceUpdate): Promise<Review> {
    const target = await this.reviewsRepository.findOne({
      where: { id: reviewId },
      relations: ['user'],
    });

    if (!target) {
      throw new UnprocessableEntityException('존재하지 않는 글입니다.');
    }

    if (target.user.id !== id) {
      throw new UnprocessableEntityException('이 글을 수정할 권한이 없습니다.');
    }

    const result = await this.reviewsRepository.save({
      ...target,
      ...updateReviewInput,
    });

    return result;
  }

  async delete({ reviewId, id }: IReviewsServiceDelete): Promise<boolean> {
    const target = await this.reviewsRepository.findOne({
      where: { id: reviewId },
      relations: ['user'],
    });

    if (!target)
      throw new UnprocessableEntityException('존재하지 않는 글입니다.');

    if (target.user.id !== id) {
      throw new UnprocessableEntityException('이 글을 삭제할 권한이 없습니다.');
    }

    await this.productsOrdersRepository.update(
      { review: { id: reviewId } },
      { review: null },
    );

    const result = await this.reviewsRepository.delete({
      id: reviewId,
    });

    return result.affected ? true : false;
  }
}
