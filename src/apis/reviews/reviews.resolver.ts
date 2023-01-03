import { UseGuards } from '@nestjs/common';
import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser } from 'src/commons/decorators/current-user.decorator';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.inputs';
import { Review } from './entities/review.entity';
import { ReviewsService } from './reviews.service';

@Resolver()
export class ReviewResolver {
  constructor(
    private readonly reviewsService: ReviewsService, //
  ) {}

  @Query(() => [Review])
  fetchReviewsByProduct(
    @Args('productId', { type: () => ID }) productId: string,
    @Args('page', { type: () => Int }) page: number,
  ) {
    return this.reviewsService.findAllByProduct({ productId, page });
  }

  @Query(() => Int)
  fetchReviewsCountByProduct(
    @Args('productId', { type: () => ID }) productId: string,
  ) {
    return this.reviewsService.findAllCountByProduct({ productId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Review])
  fetchReviewsByBuyer(
    @Args('page', { type: () => Int }) page: number,
    @CurrentUser() id: string, //
  ) {
    return this.reviewsService.findAllByBuyer({ page, id });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Int)
  fetchReviewsCountByBuyer(
    @CurrentUser() id: string, //
  ) {
    return this.reviewsService.findAllCountByBuyer({ id });
  }

  @Query(() => Review)
  fetchReview(
    @Args('reviewId', { type: () => ID }) reviewId: string,
  ): Promise<Review> {
    return this.reviewsService.findOne({ id: reviewId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Review)
  createReview(
    @Args('productOrderId', { type: () => ID }) productOrderId: string,
    @Args('createReviewInput') createReviewInput: CreateReviewInput,
    @CurrentUser() id: string,
  ): Promise<Review> {
    return this.reviewsService.create({
      productOrderId,
      id,
      createReviewInput,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Review)
  updateReview(
    @Args('updateReviewInput') updateReviewInput: UpdateReviewInput, //
    @Args('reviewId', { type: () => ID }) reviewId: string,
    @CurrentUser() id: string,
  ): Promise<Review> {
    return this.reviewsService.update({
      reviewId,
      updateReviewInput,
      id,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteReview(
    @Args('reviewId') reviewId: string,
    @CurrentUser() id: string,
  ): Promise<boolean> {
    return this.reviewsService.delete({ reviewId, id });
  }
}
