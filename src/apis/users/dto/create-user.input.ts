import { Field, InputType, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';
import { GraphQLBusinessLicenseNumber } from 'src/commons/graphql/customTypes/businessLicenseNumber.type';
import { GraphQLEmail } from 'src/commons/graphql/customTypes/email.type';
import { GraphQLPassword } from 'src/commons/graphql/customTypes/password.type';
import { GraphQLPhone } from 'src/commons/graphql/customTypes/phone.type';
import { GraphQLZipCode } from 'src/commons/graphql/customTypes/zipCode.type';

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

  @Min(1)
  @Max(7)
  @Field(() => Int)
  veganLevel: number;

  @Field(() => GraphQLZipCode, { nullable: true })
  zipCode: string;

  @Field(() => String, { nullable: true })
  address: string;

  @Field(() => String, { nullable: true })
  addressDetail: string;

  @Field(() => GraphQLBusinessLicenseNumber, { nullable: true })
  bln: string;
}
