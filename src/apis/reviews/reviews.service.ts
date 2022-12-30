import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import {
  IReviewsServiceFindOne,
  IReviewsServiceCreate,
} from './interfaces/reviews.service.interface';

Injectable();
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
  ) {}

  // 리뷰 게시글 작성
  async create({
    createReviewInput, //
  }: IReviewsServiceCreate): Promise<Review> {
    return this.reviewsRepository.save({
      ...createReviewInput,
    });
  }

  // 전체 리뷰 조회

  // 이메일로 리뷰한 게시글 조회
  findReview({ reviewId }: IReviewsServiceFindOne): Promise<Review> {
    return this.reviewsRepository.findOne({
      where: { id: reviewId },
    });
  }

  // 베스트 리뷰 조회

  // 리뷰 게시글 업데이트
  async update({ reviewId, updateReviewInput }) {
    const prevReview = await this.reviewsRepository.findOne({
      where: { id: reviewId },
    });
    const result = await this.reviewsRepository.save({
      ...prevReview,
      ...updateReviewInput,
    });
    return result;
  }
  // 리뷰 게시글 삭제
  async delete({ reviewId }) {
    const result = await this.reviewsRepository.delete({
      id: reviewId,
    });
    return result.affected ? true : false;
  }
}
