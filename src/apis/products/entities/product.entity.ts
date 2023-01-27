import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';
import { Review } from 'src/apis/reviews/entities/review.entity';
import { ProductOrder } from 'src/apis/productsOrders/entities/productOrder.entity';
import { ProductCategory } from 'src/apis/productsCategories/entities/productCategory.entity';
import { ProductOption } from 'src/apis/productsOptions/entities/productOption.entity';

@ObjectType()
@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String, { description: '상품명' })
  name: string;

  @Column({ type: 'varchar', length: 2000, nullable: true })
  @Field(() => String, {
    nullable: true,
    description: '상품 상세 정보 (최대 2000자까지 가능)',
  })
  description: string;

  @Column()
  @Field(() => String, { description: '상품 대표 이미지 url' })
  image: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true, description: '비건 레벨' })
  veganLevel: number;

  @Column()
  @Field(() => Int, { description: '상품 원가' })
  price: number;

  @Column()
  @Field(() => Int, { description: '상품 할인율' })
  discountRate: number;

  @Column()
  @Field(() => Int, { description: '상품 할인가' })
  discountedPrice: number;

  @Column()
  @Field(() => Int, { description: '상품 재고 수량' })
  quantity: number;

  @Column({ default: false })
  @Field(() => Boolean, { description: '상품 품절 여부' })
  isOutOfStock: boolean;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true, description: '상품 필수 표기정보' })
  option1: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true, description: '상품 필수 표기정보' })
  option2: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true, description: '상품 필수 표기정보' })
  option3: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true, description: '상품 필수 표기정보' })
  option4: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true, description: '상품 필수 표기정보' })
  option5: string;

  @JoinColumn()
  @OneToOne(() => ProductOption, { nullable: true })
  @Field(() => ProductOption, {
    nullable: true,
    description: '뷰티 상품에 해당하는 추가 필수 표기 정보',
  })
  productOption: ProductOption;

  @ManyToOne(() => ProductCategory, { nullable: true })
  @Field(() => ProductCategory, {
    description: '상품 카테고리',
    nullable: true,
  })
  productCategory: ProductCategory;

  @ManyToOne(() => User, { nullable: true })
  @Field(() => User, { description: '판매자', nullable: true })
  user: User;

  @OneToMany(() => Review, (reviews) => reviews.product)
  reviews: Review[];

  @OneToMany(() => ProductOrder, (productOrder) => productOrder.product)
  productOrder: ProductOrder[];

  @CreateDateColumn()
  @Field(() => GraphQLISODateTime, { description: '상품 생성날짜' })
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => GraphQLISODateTime, { description: '상품 수정 날짜' })
  updatedAt: Date;
}
