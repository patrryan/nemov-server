import { IAuthUser, IContext } from 'src/commons/types/context';
import { Request, Response } from 'express';
import { ROLE_TYPE } from 'src/apis/users/entities/user.entity';

export interface IAuthServiceLogin {
  email: string;
  password: string;
  context: IContext;
}

export interface IAuthServiceSetRefreshToken {
  id: string;
  role: ROLE_TYPE;
  req: Request & IAuthUser;
  res: Response;
}

export interface IAuthServiceGetAccessToken {
  id: string;
  role: ROLE_TYPE;
}
