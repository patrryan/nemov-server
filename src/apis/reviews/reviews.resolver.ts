import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser } from 'src/commons/decorators/current-user.decorator';
// import { IContext } from 'src/commons/types/context';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.inputs';
import { Review } from './entities/review.entity';
import { ReviewsService } from './reviews.service';

@Resolver()
export class ReviewResolver {
  constructor(
    private readonly reviewsService: ReviewsService, //
  ) {}

  @Query(() => Review)
  async fetchReview(
    @Args('reviewId', { type: () => ID }) reviewId: string, //
  ): Promise<Review> {
    return this.reviewsService.findReview({ id: reviewId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Review)
  createReview(
    @Args('createReviewInput') createReviewInput: CreateReviewInput, //
    @CurrentUser() id: string,
  ): Promise<Review> {
    return this.reviewsService.create({ id, createReviewInput });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Review)
  async updateReview(
    @Args('updateReviewInput') updateReviewInput: UpdateReviewInput, //
    @Args('reviewId', { type: () => ID }) reviewId: string,
    @CurrentUser() id: string,
  ): Promise<Review> {
    return await this.reviewsService.update({
      reviewId,
      updateReviewInput,
      id,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteReview(
    @Args('reviewId') reviewId: string,
    @CurrentUser() id: string,
  ): Promise<boolean> {
    return this.reviewsService.delete({ reviewId, id });
  }
}
