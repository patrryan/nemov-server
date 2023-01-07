import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class ProductOption {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  option6: string;

  @Column()
  @Field(() => String)
  option7: string;

  @Column()
  @Field(() => String)
  option8: string;

  @Column()
  @Field(() => String)
  option9: string;

  @Column()
  @Field(() => String)
  option10: string;

  @Column()
  @Field(() => String)
  option11: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
