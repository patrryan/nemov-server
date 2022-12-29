import { GraphQLEmail } from './email.type';
import { GraphQLPassword } from './password.type';
import { GraphQLPhone } from './phone.type';
import { GraphQLZipCode } from './zipCode.type';

export const customTypes = [
  { Email: GraphQLEmail },
  { Password: GraphQLPassword },
  { Phone: GraphQLPhone },
  { ZipCode: GraphQLZipCode },
];
