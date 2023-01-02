import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateQuestionInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  contents: string;
}
