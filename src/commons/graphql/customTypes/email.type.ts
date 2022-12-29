import { GraphQLError, GraphQLScalarType, Kind } from 'graphql';

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const validate = (value) => {
  if (typeof value !== 'string') {
    throw new GraphQLError(`Value is not string: ${value}`);
  }

  if (!EMAIL_REGEX.test(value)) {
    throw new GraphQLError(`Value is not a valid email address: ${value}`);
  }

  return value;
};

const parseLiteral = (ast) => {
  if (ast.kind !== Kind.STRING) {
    throw new GraphQLError(
      `Can only parse strings as email addresses but got a: ${ast.kind}`,
    );
  }

  return validate(ast.value);
};

const GraphQLEmailAddressConfig = {
  name: 'Email',
  description: '이메일 형식: @가 포함되어있어야함.',
  serialize: validate,
  parseValue: validate,
  parseLiteral,
};

export const GraphQLEmail = new GraphQLScalarType(GraphQLEmailAddressConfig);
