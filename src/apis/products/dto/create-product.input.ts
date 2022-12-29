import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  image: string;

  @Field(() => String)
  veganLevel: string;

  @Field(() => Int)
  deliveryFee: number;

  @Field(() => Int)
  price: number;

  @Field(() => Int)
  discount: number;

  @Field(() => Boolean)
  status: boolean;

  // @Field(() => String)
  // ProductCategoryId: string;

  // @Field(() => [String])
  // ProductAllergy: string[];

  // @Field(() => [String])
  // img_url: string;
}
