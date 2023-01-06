import { Field, InputType, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  productCategoryId: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  image: string;

  @Min(1)
  @Max(7)
  @Field(() => Int)
  veganLevel: number;

  @Min(0)
  @Field(() => Int)
  deliveryFee: number;

  @Min(0)
  @Field(() => Int)
  price: number;

  @Min(1)
  @Field(() => Int)
  quantity: number;

  @Min(0)
  @Max(100)
  @Field(() => Int)
  discount: number;
}
