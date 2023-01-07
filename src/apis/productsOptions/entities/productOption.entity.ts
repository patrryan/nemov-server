import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/apis/products/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class ProductOption {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @JoinColumn()
  @OneToOne(() => Product, (product) => product.productOption, {
    nullable: true,
  })
  product: Product;

  @Column({ type: 'varchar', length: 200, nullable: false })
  @Field(() => String, { nullable: false })
  type: string;

  @Column({ type: 'text', nullable: true, default: null })
  @Field(() => String, { nullable: true, defaultValue: null })
  option6: string;

  @Column({ type: 'text', nullable: true, default: null })
  @Field(() => String, { nullable: true, defaultValue: null })
  option7: string;

  @Column({ type: 'text', nullable: true, default: null })
  @Field(() => String, { nullable: true, defaultValue: null })
  option8: string;

  @Column({ type: 'text', nullable: true, default: null })
  @Field(() => String, { nullable: true, defaultValue: null })
  option9: string;

  @Column({ type: 'text', nullable: true, default: null })
  @Field(() => String, { nullable: true, defaultValue: null })
  option10: string;

  @Column({ type: 'text', nullable: true, default: null })
  @Field(() => String, { nullable: true, defaultValue: null })
  option11: string;

  @Column({ type: 'text', nullable: true, default: null })
  @Field(() => String, { nullable: true, defaultValue: null })
  option12: string;

  @Column({ type: 'text', nullable: true, default: null })
  @Field(() => String, { nullable: true, defaultValue: null })
  option13: string;

  @Column({ type: 'text', nullable: true, default: null })
  @Field(() => String, { nullable: true, defaultValue: null })
  option14: string;
}
