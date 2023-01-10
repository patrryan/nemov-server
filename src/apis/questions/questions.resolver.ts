import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query, ID, Int } from '@nestjs/graphql';
import {
  GqlBuyerAccessGuard,
  GqlSellerAccessGuard,
} from 'src/commons/auth/gql-auth.guard';
import { CurrentUser } from 'src/commons/decorators/current-user.decorator';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.update';
import { Question } from './entities/question.entity';
import { QuestionsService } from './questions.service';

@Resolver()
export class QuestionsResolver {
  constructor(
    private readonly questionsService: QuestionsService, //
  ) {}

  @Query(() => [Question])
  fetchQuestionsByProduct(
    @Args('productId', { type: () => ID }) productId: string, //
    @Args('page', { type: () => Int }) page: number,
  ): Promise<Question[]> {
    return this.questionsService.findAllByProduct({ productId, page });
  }

  @Query(() => Int)
  fetchQuestionsCountByProduct(
    @Args('productId', { type: () => ID }) productId: string, //
  ) {
    return this.questionsService.findAllCountByProduct({ productId });
  }

  @UseGuards(GqlBuyerAccessGuard)
  @Query(() => [Question])
  fetchQuestionsByBuyer(
    @Args('page', { type: () => Int }) page: number,
    @CurrentUser() id: string, //
  ) {
    return this.questionsService.findAllByBuyer({ page, id });
  }

  @UseGuards(GqlBuyerAccessGuard)
  @Query(() => Int)
  fetchQuestionsCountByBuyer(
    @CurrentUser() id: string, //
  ) {
    return this.questionsService.findAllCountByBuyer({ id });
  }

  @UseGuards(GqlSellerAccessGuard)
  @Query(() => [Question])
  fetchQuestionsBySeller(
    @Args('page', { type: () => Int }) page: number,
    @CurrentUser() id: string,
  ) {
    return this.questionsService.findAllBySeller({ page, id });
  }

  @UseGuards(GqlSellerAccessGuard)
  @Query(() => Int)
  fetchQuestionsCountBySeller(
    @CurrentUser() id: string, //
  ) {
    return this.questionsService.findAllCountBySeller({ id });
  }

  @UseGuards(GqlBuyerAccessGuard)
  @Mutation(() => Question)
  createQuestion(
    @Args('createQuestionInput') createQuestionInput: CreateQuestionInput, //
    @Args('productId') productId: string,
    @CurrentUser() id: string,
  ): Promise<Question> {
    return this.questionsService.create({ id, createQuestionInput, productId });
  }

  @UseGuards(GqlBuyerAccessGuard)
  @Mutation(() => Question)
  updateQuestion(
    @Args('updateQuestionInput') updateQuestionInput: UpdateQuestionInput, //
    @Args('questionId', { type: () => ID }) questionId: string,
    @CurrentUser() id: string,
  ): Promise<Question> {
    return this.questionsService.update({
      questionId,
      updateQuestionInput,
      id,
    });
  }

  @Query(() => Question)
  fetchQuestion(
    @Args('questionId', { type: () => ID }) questionId: string, //
  ): Promise<Question> {
    return this.questionsService.findQuestion({ id: questionId });
  }

  @UseGuards(GqlBuyerAccessGuard)
  @Mutation(() => Boolean)
  deleteQuestion(
    @Args('questionId') questionId: string,
    @CurrentUser() id: string,
  ): Promise<boolean> {
    return this.questionsService.delete({ questionId, id });
  }
}
