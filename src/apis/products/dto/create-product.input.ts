import { Field, InputType, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';
import { PRODUCT_CATEGORY_TYPE } from '../entities/product.entity';

@InputType()
export class CreateProductInput {
  @Field(() => String)
  name: string;

  @Field(() => PRODUCT_CATEGORY_TYPE)
  category: string;

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

  @Min(0)
  @Max(100)
  @Field(() => Int)
  discount: number;
}
