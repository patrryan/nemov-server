import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum POINT_TRANSACTION_STATUS_ENUM {
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  BOUGHT = 'BOUGHT',
  REFUNDED = 'REFUNDED',
  SOLD = 'SOLD',
  COLLECTED = 'COLLECTED',
}

registerEnumType(POINT_TRANSACTION_STATUS_ENUM, {
  name: 'POINT_TRANSACTION_STATUS_ENUM',
  description: '결제 상태에 대한 타입',
  valuesMap: {
    PAID: { description: '포인트 결제 완료' },
    CANCELLED: { description: '포인트 환불 완료' },
    BOUGHT: { description: '상품 구매 완료' },
    REFUNDED: { description: '상품 구매 취소 완료' },
    SOLD: { description: '상품 판매 완료' },
    COLLECTED: { description: '상품 판매 취소 완료' },
  },
});

@Entity()
@ObjectType()
export class Point {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ nullable: true })
  @Field(() => ID, { nullable: true })
  impUid: string;

  @Column()
  @Field(() => Int)
  amount: number;

  @Column('enum', { enum: POINT_TRANSACTION_STATUS_ENUM })
  @Field(() => POINT_TRANSACTION_STATUS_ENUM)
  status: string;

  @Column()
  @Field(() => Int)
  balance: number;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @CreateDateColumn()
  @Field(() => GraphQLISODateTime)
  createdAt: Date;
}
