import { Field, InputType, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@InputType()
export class CreateReviewInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  contents: string;

  @Min(0)
  @Max(5)
  @Field(() => Int)
  rating: number;

  @Field(() => [String], { nullable: true })
  images: string[];
}
