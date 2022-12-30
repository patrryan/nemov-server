import { CreateReviewInput } from '../dto/create-review.input';
import { Review } from '../entities/review.entity';

export interface IReviewsServiceCreate {
  createReviewInput: CreateReviewInput;
}

export interface IReviewsServiceUpdate {
  review: Review;
}

export interface IReviewsServiceFindOne {
  reviewId: string;
}
