import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from '../Images/entities/Image.entity';
import { User } from '../users/entities/user.entity';
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

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Image)
    private readonly imagesRepository: Repository<Image>,
  ) {}

  findReview({ id }: IReviewsServiceFindReview): Promise<Review> {
    return this.reviewsRepository.findOne({
      where: { id },
      relations: ['user', 'images'],
    });
  }

  async create({
    createReviewInput,
    id,
  }: IReviewsServiceCreate): Promise<Review> {
    const user = await this.usersRepository.findOne({ where: { id } });

    const { images, ...rest } = createReviewInput;

    const result = await this.reviewsRepository.save({ ...rest, user });

    if (images) {
      await Promise.all(
        images
          .filter((el) => el)
          .map((el) => {
            return new Promise(async (resolve, reject) => {
              try {
                const newImage = await this.imagesRepository.save({
                  url: el,
                  review: { id: result.id },
                });

                resolve(newImage);
              } catch (error) {
                reject(error);
              }
            });
          }),
      );
    }

    return result;
  }

  async update({
    reviewId,
    updateReviewInput,
    id,
  }: IReviewsServiceUpdate): Promise<Review> {
    const target = await this.reviewsRepository.findOne({
      where: { id: reviewId },
      relations: ['user', 'images'],
    });

    if (!target) {
      throw new UnprocessableEntityException('존재하지 않는 글입니다.');
    }

    if (target.user.id !== id) {
      throw new UnprocessableEntityException('이 글을 수정할 권한이 없습니다.');
    }

    const { images, ...rest } = updateReviewInput;
    const result = await this.reviewsRepository.save({
      ...target,
      ...rest,
    });

    if (images) {
      await this.imagesRepository.delete({
        review: { id: reviewId },
      });

      await Promise.all(
        images
          .filter((el) => el)
          .map((el) => {
            return new Promise(async (resolve, reject) => {
              try {
                const newImage = await this.imagesRepository.save({
                  url: el,
                  review: { id: result.id },
                });

                resolve(newImage);
              } catch (error) {
                reject(error);
              }
            });
          }),
      );
    }

    return result;
  }

  async delete({ reviewId, id }: IReviewsServiceDelete): Promise<boolean> {
    const target = await this.reviewsRepository.findOne({
      where: { id: reviewId },
      relations: ['user', 'images'],
    });

    if (target.user.id !== id) {
      throw new UnprocessableEntityException('이 글을 수정할 권한이 없습니다.');
    }

    const result = await this.reviewsRepository.delete({
      id: reviewId,
    });

    return result.affected ? true : false;
  }
}
