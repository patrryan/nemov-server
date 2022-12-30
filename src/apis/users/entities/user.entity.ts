import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { GraphQLBusinessLicenseNumber } from 'src/commons/graphql/customTypes/businessLicenseNumber.type';
import { GraphQLEmail } from 'src/commons/graphql/customTypes/email.type';
import { GraphQLPhone } from 'src/commons/graphql/customTypes/phone.type';
import { GraphQLZipCode } from 'src/commons/graphql/customTypes/zipCode.type';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum VEGAN_LEVEL_TYPE {
  FLEX = 'FLEX',
  POLO = 'POLO',
  PESCO = 'PESCO',
  LACTOOVO = 'LACTOOVO',
  OVO = 'OVO',
  LACTO = 'LACTO',
  VEGAN = 'VEGAN',
}

registerEnumType(VEGAN_LEVEL_TYPE, {
  name: 'VEGAN_LEVEL_TYPE',
  description: '비건 레벨(0~6단계)에 대한 타입',
  valuesMap: {
    FLEX: { description: '0단계 비건 - 플렉시테리언' },
    POLO: { description: '1단계 비건 - 폴로' },
    PESCO: { description: '2단계 비건 - 페스코' },
    LACTOOVO: { description: '3단계 비건 - 락토오보' },
    OVO: { description: '4단계 비건 - 오보' },
    LACTO: { description: '5단계 비건 - 락토' },
    VEGAN: { description: '6단계 비건 - 비건' },
  },
});

export enum ROLE_TYPE {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
}

registerEnumType(ROLE_TYPE, {
  name: 'ROLE_TYPE',
  description: '유저 역할에 대한 타입',
  valuesMap: {
    BUYER: { description: '구매자(일반 유저)' },
    SELLER: { description: '판매자' },
  },
});

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => GraphQLEmail)
  email: string;

  @Column()
  password: string;

  @Column()
  @Field(() => GraphQLPhone)
  phone: string;

  @Column({ type: 'enum', enum: VEGAN_LEVEL_TYPE, nullable: true })
  @Field(() => VEGAN_LEVEL_TYPE, { nullable: true })
  veganLevel: VEGAN_LEVEL_TYPE;

  @Column({ nullable: true })
  @Field(() => GraphQLZipCode, { nullable: true })
  zipCode: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  address: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  addressDetail: string;

  @Column({ nullable: true })
  @Field(() => GraphQLBusinessLicenseNumber, { nullable: true })
  bln: string;

  @Column({ type: 'enum', enum: ROLE_TYPE })
  @Field(() => ROLE_TYPE)
  role: ROLE_TYPE;

  @Column({ default: 0 })
  @Field(() => Int)
  point: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
