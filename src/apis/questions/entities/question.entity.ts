import { Field, ID, ObjectType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';
import { Answer } from 'src/apis/answer/entities/answer.entity';
import { Product } from 'src/apis/products/entities/product.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @MinLength(2, { message: '최소 2글자 이상' })
  @Column()
  @Field(() => String)
  title: string;

  @MaxLength(200, { message: '최대 200글자 이하' })
  @MinLength(10, { message: '최소 10글자 이상' })
  @Column()
  @Field(() => String)
  contents: string;

  @ManyToOne(() => Product)
  @Field(() => Product)
  product: Product;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @JoinColumn()
  @OneToOne(() => Answer, { nullable: true })
  @Field(() => Answer, { nullable: true })
  answer: Answer;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
