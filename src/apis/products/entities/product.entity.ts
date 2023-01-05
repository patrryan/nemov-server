import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';
import { Review } from 'src/apis/reviews/entities/review.entity';
import { ProductOrder } from 'src/apis/productsOrders/entities/productOrder.entity';
import { ProductCategory } from 'src/apis/productsCategories/entities/productCategory.entity';

@ObjectType()
@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
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
  deliveryFee: number;

  @Column()
  @Field(() => Int)
  price: number;

  @Column()
  @Field(() => Int)
  discount: number;

  @Column()
  @Field(() => Int)
  quantity: number;

  @Column({ default: false })
  @Field(() => Boolean)
  isOutOfStock: boolean;

  @OneToMany(() => Review, (reviews) => reviews.product)
  reviews: Review[];

  @OneToMany(() => ProductOrder, (productOrder) => productOrder.product)
  productOrder: ProductOrder[];

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => ProductCategory)
  @Field(() => ProductCategory)
  productCategory: ProductCategory;

  @CreateDateColumn()
  createdAt: Date;
}
