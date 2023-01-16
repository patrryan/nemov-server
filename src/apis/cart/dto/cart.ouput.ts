import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/apis/products/entities/product.entity';

@ObjectType()
export class CartOutput {
  @Field(() => Product)
  product: Product;

  @Field(() => Int, {
    description: '장바구니에 담긴 상품 수량',
    nullable: true,
  })
  count: number;
}
