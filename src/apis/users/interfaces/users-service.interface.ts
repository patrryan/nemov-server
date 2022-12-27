export interface IUsersServiceCreate {
  email: string;
  hashedPassword: string;
  name: string;
  address: string;
  phoneNumber: string;
  veganLevel: string;
}

export interface IUsersServiceFindOne {
  email: string;
}
