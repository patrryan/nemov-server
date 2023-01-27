import { GraphQLError, GraphQLScalarType, Kind } from 'graphql';

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?])[A-Za-z\d!@#$%^&*?]{8,16}$/;

const validate = (value) => {
  if (typeof value !== 'string') {
    throw new GraphQLError(`Value is not string: ${value}`);
  }

  if (!PASSWORD_REGEX.test(value)) {
    throw new GraphQLError(`Value is not a valid password: ${value}`);
  }

  return value;
};

const parseLiteral = (ast) => {
  if (ast.kind !== Kind.STRING) {
    throw new GraphQLError(
      `Can only parse strings as password but got a: ${ast.kind}`,
    );
  }

  return validate(ast.value);
};

const GraphQLPasswordConfig = {
  name: 'Password',
  description:
    '비밀번호 형식: 알파벳 대,소문자, 숫자, 특수기호(!@#$%^&*?) 각 1개씩 포함, (최소: 8글자, 최대 16글자)',
  serialize: validate,
  parseValue: validate,
  parseLiteral,
};

export const GraphQLPassword = new GraphQLScalarType(GraphQLPasswordConfig);
