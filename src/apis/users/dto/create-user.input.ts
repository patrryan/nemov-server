import { Field, InputType } from '@nestjs/graphql';
import { GraphQLEmail } from 'src/commons/graphql/customTypes/email.type';
import { GraphQLPassword } from 'src/commons/graphql/customTypes/password.type';
import { GraphQLPhone } from 'src/commons/graphql/customTypes/phone.type';
import { GraphQLZipCode } from 'src/commons/graphql/customTypes/zipCode.type';
import { VEGAN_LEVEL_TYPE } from '../entities/user.entity';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  name: string;

  @Field(() => GraphQLEmail)
  email: string;

  @Field(() => GraphQLPassword)
  password: string;

  @Field(() => GraphQLPhone)
  phone: string;

  @Field(() => VEGAN_LEVEL_TYPE)
  veganLevel: string;

  @Field(() => GraphQLZipCode)
  zipCode: string;

  @Field(() => String)
  address: string;

  @Field(() => String)
  addressDetail: string;
}
