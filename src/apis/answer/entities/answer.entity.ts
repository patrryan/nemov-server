import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Question } from 'src/apis/questions/entities/question.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  contents: string;

  @OneToOne(() => Question)
  @Field(() => Question)
  question: Question;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @CreateDateColumn()
  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @CreateDateColumn()
  @Field(() => GraphQLISODateTime)
  deletedAt: Date;
}
