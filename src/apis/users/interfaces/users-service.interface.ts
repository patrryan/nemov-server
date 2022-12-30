import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';

export interface IUsersServiceFindOneById {
  id: string;
}

export interface IUsersServiceCheckBLN {
  bln: string;
}

export interface IUsersServiceValidateUser {
  email: string;
  phone: string;
  bln: string;
}

export interface IUsersServiceFindOneByEmail {
  email: string;
}

export interface IUsersServiceCreate {
  createUserInput: CreateUserInput;
}

export interface IUsersServiceVerifyPassword {
  id: string;
  password: string;
}

export interface IUsersServiceUpdate {
  id: string;
  updateUserInput: UpdateUserInput;
}

export interface IUsersServiceUpdatePassword {
  id: string;
  password: string;
}

export interface IUsersServiceLoginDelete {
  id: string;
}

export interface IUsersServiceRestore {
  email: string;
}
