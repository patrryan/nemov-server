import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateProductOrderInput {
  @Field(() => ID)
  productId: string;

  @Field(() => Int)
  quantity: number;

  // check price for each product
  // @Field(() => Int)
  // price: number
}
