import { Field, InputType, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';
import { VEGAN_LEVEL_TYPE } from 'src/apis/users/entities/user.entity';
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

  @Field(() => VEGAN_LEVEL_TYPE, { nullable: true })
  veganLevel: string;

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
