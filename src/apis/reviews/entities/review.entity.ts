import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { Image } from 'src/apis/Images/entities/Image.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  contents: string;

  @Column()
  @Field(() => Int)
  rating: number;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @OneToMany(() => Image, (image) => image.review, {
    nullable: true,
    cascade: true,
  })
  @Field(() => [Image], { nullable: true })
  images: Image[];

  @CreateDateColumn()
  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
