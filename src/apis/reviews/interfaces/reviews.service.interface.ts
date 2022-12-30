import { Image } from 'src/apis/Images/entities/Image.entity';
import { IContext } from 'src/commons/types/context';
import { CreateReviewInput } from '../dto/create-review.input';
import { Review } from '../entities/review.entity';

export interface IReviewsServiceCreate {
  createReviewInput: CreateReviewInput;
  context: IContext;
  imageId: Image;
}

export interface IReviewsServiceUpdate {
  review: Review;
  context: IContext;
}

export interface IReviewsServiceFindOne {
  reviewId: string;
}
