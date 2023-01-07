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

  @Column()
  @Field(() => String)
  description: string;

  @Column()
  @Field(() => String)
  image: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  veganLevel: number;

  @Column()
  @Field(() => Int)
  price: number;

  @Column()
  @Field(() => Int)
  discountRate: number;

  @Column()
  @Field(() => Int, { description: '상품 할인가' })
  discountedPrice: number;

  @Column()
  @Field(() => Int)
  quantity: number;

  @Column({ default: false })
  @Field(() => Boolean)
  isOutOfStock: boolean;

  @Column()
  @Field(() => String)
  option1: string;

  @Column()
  @Field(() => String)
  option2: string;

  @Column()
  @Field(() => String)
  option3: string;

  @Column()
  @Field(() => String)
  option4: string;

  @Column()
  @Field(() => String)
  option5: string;

  @JoinColumn()
  @OneToOne(() => ProductOption, { nullable: true })
  @Field(() => ProductOption, {
    nullable: true,
    description: '뷰티 상품에 해당하는 추가 필수 표기 정보',
  })
  productOption: ProductOption;

  @ManyToOne(() => ProductCategory)
  @Field(() => ProductCategory, { description: '상품 카테고리' })
  productCategory: ProductCategory;

  @ManyToOne(() => User)
  @Field(() => User, { description: '판매자' })
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
