import { UseGuards } from '@nestjs/common';
import { Query, Args, Mutation, Resolver, Context } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth-guard';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.inputs';
import { Review } from './entities/review.entity';
import { ReviewsService } from './reviews.service';

@Resolver()
export class ReviewResolver {
  constructor(
    private readonly reviewsService: ReviewsService, //
  ) {}

  @Mutation(() => Review)
  createReview(
    @Args('createReviewInput') createReviewInput: CreateReviewInput, //
  ): Promise<Review> {
    return this.reviewsService.create({ createReviewInput });
  }

  // 리뷰 조회
  @Query(() => Review)
  async fetchReview(
    @Args('reviewId') reviewId: string, //
  ) {
    return this.reviewsService.findReview({ reviewId });
  }

  // 베스트 리뷰 조회

  // 리뷰 게시글 업데이트
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Review)
  async updateReview(
    @Args('updateReviewInput') updateReviewInput: UpdateReviewInput, //
    @Args('reviewId') reviewId: string,
  ) {
    return await this.reviewsService.update({ reviewId, updateReviewInput });
  }

  // 리뷰 게시글 삭제
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteReview(
    @Args('reviewId') reviewId: string, //
  ) {
    return this.reviewsService.delete({ reviewId });
  }
}
