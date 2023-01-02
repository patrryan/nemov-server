import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Product } from 'src/apis/products/entities/product.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PRODUCT_ORDER_STATUS_ENUM {
  BOUGHT = 'BOUGHT',
  REFUNDED = 'REFUNDED',
}

registerEnumType(PRODUCT_ORDER_STATUS_ENUM, {
  name: 'PRODUCT_ORDER_STATUS_ENUM',
  description: '상품 구매에 대한 타입',
  valuesMap: {
    BOUGHT: { description: '상품 구매 완료' },
    REFUNDED: { description: '상품 취소 완료' },
  },
});

@Entity()
@ObjectType()
export class ProductOrder {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => Int)
  amount: number;

  @Column()
  @Field(() => Int)
  quantity: number;

  @Column('enum', { enum: PRODUCT_ORDER_STATUS_ENUM })
  @Field(() => PRODUCT_ORDER_STATUS_ENUM)
  status: string;

  @ManyToOne(() => User)
  @Field(() => User)
  buyer: User;

  @ManyToOne(() => User)
  @Field(() => User)
  seller: User;

  @ManyToOne(() => Product)
  @Field(() => Product)
  product: Product;

  @CreateDateColumn()
  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
