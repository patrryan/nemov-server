import { CreateReviewInput } from '../dto/create-review.input';
import { UpdateReviewInput } from '../dto/update-review.inputs';

export interface IReviewsServiceFindReview {
  id: string;
}

export interface IReviewsServiceCreate {
  createReviewInput: CreateReviewInput;
  id: string;
}

export interface IReviewsServiceUpdate {
  reviewId: string;
  updateReviewInput: UpdateReviewInput;
  id: string;
}

export interface IReviewsServiceDelete {
  reviewId: string;
  id: string;
}
