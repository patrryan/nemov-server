import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateReviewInput } from './create-review.input';

@InputType()
export class UpdateReviewInput extends PartialType(
  OmitType(CreateReviewInput, ['images'], InputType),
) {
  @Field(() => [String], { nullable: 'itemsAndList' })
  images: string[];
}
