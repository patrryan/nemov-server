import { Field, InputType } from '@nestjs/graphql';
import { MinLength } from 'class-validator';

@InputType()
export class CreateProductOptionInput {
  @MinLength(1, { message: '상품 필수 표기 정보를 입력해주세요.' })
  @Field(() => String)
  option6: string;

  @MinLength(1, { message: '상품 필수 표기 정보를 입력해주세요.' })
  @Field(() => String)
  option7: string;

  @MinLength(1, { message: '상품 필수 표기 정보를 입력해주세요.' })
  @Field(() => String)
  option8: string;

  @MinLength(1, { message: '상품 필수 표기 정보를 입력해주세요.' })
  @Field(() => String)
  option9: string;

  @MinLength(1, { message: '상품 필수 표기 정보를 입력해주세요.' })
  @Field(() => String)
  option10: string;

  @MinLength(1, { message: '상품 필수 표기 정보를 입력해주세요.' })
  @Field(() => String)
  option11: string;
}
