import { UseGuards } from '@nestjs/common';
import { Query, Args, Mutation, Resolver, Context } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth-guard';
import { IContext } from 'src/commons/types/context';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.inputs';
import { Review } from './entities/review.entity';
import { ReviewsService } from './reviews.service';

@Resolver()
export class ReviewResolver {
  constructor(
    private readonly reviewsService: ReviewsService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Review)
  createReview(
    @Args('createReviewInput') createReviewInput: CreateReviewInput, //
    @Context() context: IContext,
  ): Promise<Review> {
    return this.reviewsService.create({ context, createReviewInput });
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
    @Context() context: IContext,
  ) {
    return await this.reviewsService.update({
      reviewId,
      updateReviewInput,
      context,
    });
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
