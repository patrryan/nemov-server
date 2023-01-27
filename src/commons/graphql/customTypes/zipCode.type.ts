import { GraphQLError, GraphQLScalarType, Kind } from 'graphql';

const ZIPCODE_REGEX = /^(0[1-9]|[1-5][0-9]|6[0-3])[0-9]{3}$/;

const validate = (value) => {
  if (typeof value !== 'string') {
    throw new GraphQLError(`Value is not string: ${value}`);
  }

  if (!ZIPCODE_REGEX.test(value)) {
    throw new GraphQLError(`Value is not a valid zipCode: ${value}`);
  }

  return value;
};

const parseLiteral = (ast) => {
  if (ast.kind !== Kind.STRING) {
    throw new GraphQLError(
      `Can only parse strings as zipCode but got a: ${ast.kind}`,
    );
  }

  return validate(ast.value);
};

const GraphQLZipCodeConfig = {
  name: 'ZipCode',
  description: '우편번호',
  serialize: validate,
  parseValue: validate,
  parseLiteral,
};

export const GraphQLZipCode = new GraphQLScalarType(GraphQLZipCodeConfig);
