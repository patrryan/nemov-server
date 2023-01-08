import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateProductOrderInput {
  @Field(() => ID)
  productId: string;

  @Field(() => Int)
  quantity: number;
}
