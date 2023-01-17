import { GraphQLError, GraphQLScalarType, Kind } from 'graphql';

const BUSINESS_LICENSE_NUMBER_REGEX =
  /^(10[1-9]|1[1-9][0-9]|[2-9][0-9]{2})\-(0[1-9]|[1-9][0-9])\-(000[1-9]|00[1-9][0-9]|01[0-9]{2}|[1-9][0-9]{3})[0-9]$/;

const validate = (value) => {
  if (typeof value !== 'string') {
    throw new GraphQLError(`Value is not string: ${value}`);
  }

  if (!BUSINESS_LICENSE_NUMBER_REGEX.test(value)) {
    throw new GraphQLError(
      `Value is not a valid business license number: ${value}`,
    );
  }

  return value;
};

const parseLiteral = (ast) => {
  if (ast.kind !== Kind.STRING) {
    throw new GraphQLError(
      `Can only parse strings as business license number but got a: ${ast.kind}`,
    );
  }

  return validate(ast.value);
};

const GraphQLBusinessLicenseNumberConfig = {
  name: 'BusinessLicenseNumber',
  description: '사업자등록번호형식: (101~999)-(01~99)-(0001~9999)(0~9)',
  serialize: validate,
  parseValue: validate,
  parseLiteral,
};

export const GraphQLBusinessLicenseNumber = new GraphQLScalarType(
  GraphQLBusinessLicenseNumberConfig,
);
