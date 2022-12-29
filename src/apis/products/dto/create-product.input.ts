import { Field, InputType, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { CreateDateColumn } from 'typeorm';
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

  @Field(() => String)
  veganLevel: string;

  @Min(0)
  @Field(() => Int)
  deliveryFee: number;

  @Min(0)
  @Field(() => Int)
  price: number;

  @Min(0)
  @Field(() => Int)
  discount: number;

  @CreateDateColumn()
  createdAt: Date;
}
