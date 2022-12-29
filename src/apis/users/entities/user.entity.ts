import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { GraphQLEmail } from 'src/commons/graphql/customTypes/email.type';
import { GraphQLPhone } from 'src/commons/graphql/customTypes/phone.type';
import { GraphQLZipCode } from 'src/commons/graphql/customTypes/zipCode.type';
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
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

  @Column({ type: 'enum', enum: VEGAN_LEVEL_TYPE })
  @Field(() => VEGAN_LEVEL_TYPE)
  veganLevel: string;

  @Column()
  @Field(() => GraphQLZipCode)
  zipCode: string;

  @Column()
  @Field(() => String)
  address: string;

  @Column()
  @Field(() => String)
  addressDetail: string;

  @Column({ default: 0 })
  @Field(() => Int)
  point: number;

  @DeleteDateColumn()
  deletedAt: Date;
}
