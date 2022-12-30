import { Field, InputType, Int } from '@nestjs/graphql';
import { Column } from 'typeorm';

@InputType()
export class CreateReviewInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  contents: string;

  @Column({ default: 0 })
  @Field(() => Int)
  rating: number;

  @Field(() => [String])
  imageId: string[];
}
