import {
  Entity,
  Column,
  JoinTable,
  OneToOne,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';
// import { ProductAllergy } from 'src/apis/productsAllergy/productAllergy.entity'
// import { Payment } from 'src/apis/payment/entities/payment.entity'
// import { ProductCategory } from 'src/apis/productsCategory/entities/productCategory.entity'
import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum PRODUCT_CATEGORY_TYPE { //
  FOOD = 'FOOD',
  BEVERAGE = 'BEVERAGE',
  BEAUTY = 'BEAUTY',
  LIFE = 'LIFE',
}

registerEnumType(PRODUCT_CATEGORY_TYPE, {
  name: 'PRODUCT_CATEGORY_TYPE',
});

@ObjectType()
@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column({ type: 'enum', enum: PRODUCT_CATEGORY_TYPE })
  @Field(() => PRODUCT_CATEGORY_TYPE)
  category: string;

  @Column()
  @Field(() => String)
  description: string;

  @Column()
  @Field(() => String)
  image: string;

  @Column()
  @Field(() => String)
  veganLevel: string;

  @Column()
  @Field(() => Int)
  deliveryFee: number;

  @Column()
  @Field(() => Int)
  price: number;

  @Column()
  @Field(() => Int)
  discount: number;

  @Column({ default: false })
  @Field(() => Boolean)
  status: boolean;

  //////////////////////////////////////

  // @ManyToOne(() => ProductCategory)
  // @Field(() => ProductCategory)
  // productCategory: ProductCategory;

  // @JoinColumn()
  // @OneToOne(() => Payment)
  // @Field(() => Payment)
  // payment: Payment;

  // @JoinTable()
  // @Field(() => [ProductAllergy])
  // @ManyToMany(() => ProductAllergy, (productAllergy) => productAllergy.products)
  // productAllergy: ProductAllergy[]

  // @JoinColumn()
  // @OneToOne(() => Payment)
  // @Field(()=>Payment)
  // payment: Payment;
}
