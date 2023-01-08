import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, MinLength } from 'class-validator';

@InputType()
export class CreateProductOptionInput {
  @IsOptional()
  @MinLength(1)
  @Field(() => String)
  option6: string;

  @IsOptional()
  @MinLength(1)
  @Field(() => String)
  option7: string;

  @IsOptional()
  @MinLength(1)
  @Field(() => String)
  option8: string;

  @IsOptional()
  @MinLength(1)
  @Field(() => String)
  option9: string;

  @IsOptional()
  @MinLength(1)
  @Field(() => String)
  option10: string;

  @IsOptional()
  @MinLength(1)
  @Field(() => String)
  option11: string;
}
