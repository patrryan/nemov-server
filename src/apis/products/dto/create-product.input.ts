import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { Max, MaxLength, Min, MinLength } from 'class-validator';

@InputType()
export class CreateProductInput {
  @MaxLength(30)
  @Field(() => String, { description: '상품명' })
  name: string;

  @Field(() => ID, { description: '상품 카테고리에 해당하는 ID' })
  productCategoryId: string;

  @MaxLength(2000)
  @Field(() => String, { description: '상품 상세설명 (최대 2000자)' })
  description: string;

  @Field(() => String, { description: '상품 대표 이미지에 해당하는 url' })
  image: string;

  @Min(1, { message: '비건 레벨을 확인해주세요.' })
  @Max(7, { message: '비건 레벨을 확인해주세요.' })
  @Field(() => Int, {
    description: '비건 레벨에 해당하는 숫자, 1: 플레시테리언 ~ 7: 비건',
  })
  veganLevel: number;

  @Min(1, { message: '상품 가격을 확인해주세요.' })
  @Field(() => Int, { description: '상품 원가' })
  price: number;

  @Min(0, { message: '상품 할인율을 확인해주세요.' })
  @Max(100, { message: '상품 할인율을 확인해주세요.' })
  @Field(() => Int, { description: '상품 할인율, 0 ~ 100' })
  discountRate: number;

  @Min(0)
  @Field(() => Int, { description: '상품 재고 수량' })
  quantity: number;

  @MinLength(1, { message: '상품 필수 표기 정보를 입력해주세요.' })
  @Field(() => String, { description: '품명 및 모델명' })
  option1: string;

  @MinLength(1, { message: '상품 필수 표기 정보를 입력해주세요.' })
  @Field(() => String, { description: '제조국(원산지)' })
  option2: string;

  @MinLength(1, { message: '상품 필수 표기 정보를 입력해주세요.' })
  @Field(() => String, { description: '인증/허가 사항' })
  option3: string;

  @MinLength(1, { message: '상품 필수 표기 정보를 입력해주세요.' })
  @Field(() => String, { description: '제조사(수입자)' })
  option4: string;

  @MinLength(1, { message: '상품 필수 표기 정보를 입력해주세요.' })
  @Field(() => String, { description: '소비자 상담 관련 전화번호' })
  option5: string;
}
