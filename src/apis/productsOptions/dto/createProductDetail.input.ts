import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateProductOptionInput {
  @Field(() => String, { nullable: false })
  type: string;

  @Field(() => String, { nullable: true, defaultValue: null })
  option6: string;

  @Field(() => String, { nullable: true, defaultValue: null })
  option7: string;

  @Field(() => String, { nullable: true, defaultValue: null })
  option8: string;

  @Field(() => String, { nullable: true, defaultValue: null })
  option9: string;

  @Field(() => String, { nullable: true, defaultValue: null })
  option10: string;

  @Field(() => String, { nullable: true, defaultValue: null })
  option11: string;

  @Field(() => String, { nullable: true, defaultValue: null })
  option12: string;

  @Field(() => String, { nullable: true, defaultValue: null })
  option13: string;

  @Field(() => String, { nullable: true, defaultValue: null })
  option14: string;
}
