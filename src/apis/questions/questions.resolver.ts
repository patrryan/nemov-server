import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query, ID, Int } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
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

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Question)
  async createQuestion(
    @Args('createQuestionInput') createQuestionInput: CreateQuestionInput, //
    @Args('productId') productId: string,
    @CurrentUser() id: string,
  ): Promise<Question> {
    return this.questionsService.create({ id, createQuestionInput, productId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Question)
  async updateQuestion(
    @Args('updateQuestionInput') updateQuestionInput: UpdateQuestionInput, //
    @Args('questionId', { type: () => ID }) questionId: string,
    @CurrentUser() id: string,
  ): Promise<Question> {
    return await this.questionsService.update({
      questionId,
      updateQuestionInput,
      id,
    });
  }

  @Query(() => Question)
  async fetchQuestion(
    @Args('questionId', { type: () => ID }) questionId: string, //
  ): Promise<Question> {
    return this.questionsService.findQuestion({ id: questionId });
  }

  @Query(() => [Question])
  async fetchQuestionsByProduct(
    @Args('productId', { type: () => ID }) productId: string, //
    @Args('page', { type: () => Int }) page: number,
  ): Promise<Question[]> {
    return this.questionsService.findAllByProduct({ productId, page });
  }

  @Query(() => Int)
  async fetchQuestionsCountByProduct(
    @Args('productId', { type: () => ID }) productId: string, //
  ) {
    return this.questionsService.findAllCountByProduct({ productId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteQuestion(
    @Args('questionId') questionId: string,
    @CurrentUser() id: string,
  ): Promise<boolean> {
    return this.questionsService.delete({ questionId, id });
  }
}
