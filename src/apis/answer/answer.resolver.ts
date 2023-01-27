import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Resolver, Query } from '@nestjs/graphql';
import { GqlSellerAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser } from 'src/commons/decorators/current-user.decorator';
import { AnswersService } from './answer.service';
import { Answer } from './entities/answer.entity';

@Resolver()
export class AnswersResolver {
  constructor(
    private readonly answersService: AnswersService, //
  ) {}

  @Query(() => Answer)
  async fetchAnswer(
    @Args('answerId', { type: () => ID }) answerId: string,
  ): Promise<Answer> {
    return this.answersService.findOne({ answerId });
  }

  @Query(() => Answer)
  fetchAnswerByQuestion(
    @Args('questionId', { type: () => ID }) questionId: string,
  ): Promise<Answer> {
    return this.answersService.findOneByQuestion({
      questionId,
    });
  }

  @UseGuards(GqlSellerAccessGuard)
  @Mutation(() => Answer)
  async createAnswer(
    @Args('questionId', { type: () => ID }) questionId: string,
    @Args('contents') contents: string,
    @CurrentUser() id: string,
  ): Promise<Answer> {
    return await this.answersService.create({
      questionId,
      contents,
      id,
    });
  }

  @UseGuards(GqlSellerAccessGuard)
  @Mutation(() => Answer)
  async updateAnswer(
    @Args('answerId', { type: () => ID }) answerId: string, //
    @Args('contents') contents: string,
    @CurrentUser() id: string,
  ): Promise<Answer> {
    return await this.answersService.update({
      answerId,
      contents,
      id,
    });
  }

  @UseGuards(GqlSellerAccessGuard)
  @Mutation(() => Boolean)
  async deleteAnswer(
    @Args('answerId', { type: () => ID }) answerId: string,
    @CurrentUser() id: string,
  ): Promise<boolean> {
    return this.answersService.delete({ answerId, id });
  }
}
