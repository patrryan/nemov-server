import { CreateUserInput } from '../dto/create-user.input';

export interface IUsersServiceCreate {
  hashedPassword: string;
  createUserInput: CreateUserInput;
}

export interface IUsersServiceFindOne {
  email: string;
}
