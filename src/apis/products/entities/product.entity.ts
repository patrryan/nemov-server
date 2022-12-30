import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { VEGAN_LEVEL_TYPE } from 'src/apis/users/entities/user.entity';

export enum PRODUCT_CATEGORY_TYPE { //
  FOOD = 'FOOD',
  DRINK = 'DRINK',
  BEAUTY = 'BEAUTY',
  LIFE = 'LIFE',
}

registerEnumType(PRODUCT_CATEGORY_TYPE, {
  name: 'PRODUCT_CATEGORY_TYPE',
  description: '물품 카테고리에 대한 타입',
  valuesMap: {
    FOOD: { description: '식품 카테고리' },
    DRINK: { description: '음료 카테고리' },
    BEAUTY: { description: '화장품 카테고리' },
    LIFE: { description: '생활용품 카테고리' },
  },
});

@ObjectType()
@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
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

  @Column({ nullable: true })
  @Field(() => VEGAN_LEVEL_TYPE, { nullable: true })
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

  @CreateDateColumn()
  createdAt: Date;
}
