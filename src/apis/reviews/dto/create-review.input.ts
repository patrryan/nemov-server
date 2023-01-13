import { Field, InputType, Int } from '@nestjs/graphql';
import { Max, Min, MinLength } from 'class-validator';

@InputType()
export class CreateReviewInput {
  @MinLength(1, { message: '리뷰 제목을 입력해주세요' })
  @Field(() => String)
  title: string;

  @MinLength(1, { message: '리뷰 내용을 입력해주세요.' })
  @Field(() => String)
  contents: string;

  @Min(0, { message: '평점을 확인해주세요' })
  @Max(5, { message: '평점을 확인해주세요' })
  @Field(() => Int)
  rating: number;

  @Field(() => [String], { nullable: 'itemsAndList' })
  images: string[];
}
