import { Field, InputType } from '@nestjs/graphql';
import { DeleteDateColumn } from 'typeorm';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  address: string;

  @Field(() => String)
  phoneNumber: string;

  @Field(() => String)
  veganLevel: string;

  @Field(() => String)
  addressDetail: string;

  @Field(() => String)
  zipCode: string;

  @DeleteDateColumn()
  deletedAt: Date;
}
