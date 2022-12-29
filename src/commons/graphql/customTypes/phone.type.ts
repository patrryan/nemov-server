import { GraphQLError, GraphQLScalarType, Kind } from 'graphql';

const PHONE_REGEX = /^(010|011)\-[0-9]{3,4}\-[0-9]{4}$/;

const validate = (value) => {
  if (typeof value !== 'string') {
    throw new GraphQLError(`Value is not string: ${value}`);
  }

  if (!PHONE_REGEX.test(value)) {
    throw new GraphQLError(
      `Value is not a valid mobile phone number: ${value}`,
    );
  }

  return value;
};

const parseLiteral = (ast) => {
  if (ast.kind !== Kind.STRING) {
    throw new GraphQLError(
      `Can only parse strings as mobile phone number but got a: ${ast.kind}`,
    );
  }

  return validate(ast.value);
};

const GraphQLMobilePhoneNumberConfig = {
  name: 'Phone',
  description: '일반적인 핸드폰 번호 형식을 적용. 번호 사이에 -가 들어감',
  serialize: validate,
  parseValue: validate,
  parseLiteral,
};

export const GraphQLPhone = new GraphQLScalarType(
  GraphQLMobilePhoneNumberConfig,
);
