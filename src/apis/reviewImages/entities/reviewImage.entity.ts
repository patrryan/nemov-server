import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Review } from 'src/apis/reviews/entities/review.entity';

@Entity()
@ObjectType()
export class ReviewImage {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  url: string;

  @ManyToOne(() => Review, (review) => review.images, { onDelete: 'CASCADE' })
  review: Review;

  @CreateDateColumn()
  createdAt: Date;
}
