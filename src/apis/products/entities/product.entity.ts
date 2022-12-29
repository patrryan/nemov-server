import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum PRODUCT_CATEGORY_TYPE { //
  FOOD = 'FOOD',
  DRINK = 'DRINK',
  BEAUTY = 'BEAUTY',
  LIFE = 'LIFE',
}

registerEnumType(PRODUCT_CATEGORY_TYPE, {
  name: 'PRODUCT_CATEGORY_TYPE',
});

@ObjectType()
@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column({ type: 'enum', enum: PRODUCT_CATEGORY_TYPE })
  @Field(() => PRODUCT_CATEGORY_TYPE)
  category: string;

  @Column()
  @Field(() => String)
  description: string;

  @Column()
  @Field(() => String)
  image: string;

  @Column()
  @Field(() => String)
  veganLevel: string;

  @Column()
  @Field(() => Int)
  deliveryFee: number;

  @Column()
  @Field(() => Int)
  price: number;

  @Column()
  @Field(() => Int)
  discount: number;

  @Column({ default: false })
  @Field(() => Boolean)
  isOutOfStock: boolean;
}
