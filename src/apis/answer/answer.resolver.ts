// import { UseGuards } from '@nestjs/common';
// import { Args, ID, Mutation, Resolver, Query } from '@nestjs/graphql';
// import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
// import { CurrentUser } from 'src/commons/decorators/current-user.decorator';
// import { AnswersService } from './answer.service';
// import { Answer } from './entities/answer.entity';

// @Resolver()
// export class AnswersResolver {
//   constructor(
//     private readonly answersService: AnswersService, //
//   ) {}

//   @Query(() => Answer)
//   async fetchAnswer(
//     @Args('answerId', { type: () => ID }) answerId: string, //
//   ): Promise<Answer> {
//     return this.answersService.findAnswer({ id: answerId });
//   }

//   @UseGuards(GqlAuthAccessGuard)
//   @Mutation(() => Answer)
//   async createAnswer(
//     @Args('answerId', { type: () => ID }) answerId: string,
//     @Args('answers_contents') answers_contents: string, //
//     @CurrentUser() id: string,
//   ): Promise<Answer> {
//     return await this.answersService.create({
//       answerId,
//       answers_contents,
//       id,
//     });
//   }

//   @UseGuards(GqlAuthAccessGuard)
//   @Mutation(() => Answer)
//   async updateAnswer(
//     @Args('answerId', { type: () => ID }) answerId: string,
//     @Args('answers_contents') answers_contents: string,
//     @CurrentUser() id: string,
//   ): Promise<Answer> {
//     return await this.answersService.update({ answerId, answers_contents, id });
//   }
// }
