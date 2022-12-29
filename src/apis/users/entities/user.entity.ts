import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  password: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column({ type: 'char', length: 11, nullable: false })
  @Column({ type: 'char', length: 11, nullable: true })
  @Field(() => String)
  phoneNumber: string;

  @Column()
  @Field(() => String)
  veganLevel: string;

  @Column()
  @Field(() => String)
  address: string;

  @Column()
  @Field(() => String)
  addressDetail: string;

  @Column()
  @Field(() => String)
  zipCode: string;

  @Column({ default: 0 })
  @Field(() => Int)
  point: number;

  @DeleteDateColumn()
  deletedAt: Date;
}
