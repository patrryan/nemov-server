import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from '../Images/entities/Image.entity';
import { User } from '../users/entities/user.entity';
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

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Image)
    private readonly imagesRepository: Repository<Image>,
  ) {}

  // 리뷰 게시글 작성
  async create({
    createReviewInput, //
    context,
  }: IReviewsServiceCreate): Promise<Review> {
    const userID = context.req.user.id;
    const resultUser = await this.usersRepository.findOne({
      where: {
        id: userID,
      },
    });
    const images = await this.imagesRepository.findOne({
      where: { id: imageId },
    });

    const result = this.reviewsRepository.save({
      ...createReviewInput,
      user: {
        ...resultUser,
      },
    });

    return await this.imagesRepository.save({
      ...result,
      ...images,
    });
  }

  // 전체 리뷰 조회

  // 이메일로 리뷰한 게시글 조회
  findReview({ reviewId }: IReviewsServiceFindOne): Promise<Review> {
    return this.reviewsRepository.findOne({
      where: { id: reviewId },
      relations: ['user'],
    });
  }

  // 베스트 리뷰 조회

  // 리뷰 게시글 업데이트
  async update({ reviewId, updateReviewInput, context }) {
    const userID = context.req.user.id;

    const prevReview = await this.reviewsRepository.findOne({
      where: { id: reviewId },
      relations: ['user', 'image'],
    });
    if (prevReview.user.id !== userID) {
      throw new UnprocessableEntityException('이 글을 수정할 권한이 없습니다.');
    }

    const { imageId, ...rest } = updateReviewInput;
    let newImage = [];
    if (imageId) {
      const image = await this.imagesRepository.findOne({
        where: { id: imageId },
      });
      newImage = [image];
    }

    const result = await this.reviewsRepository.save({
      ...rest,
      ...prevReview,
      ...updateReviewInput,
      ...newImage,
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
