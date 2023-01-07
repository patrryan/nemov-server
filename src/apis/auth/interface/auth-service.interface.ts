import { IAuthUser, IContext } from 'src/commons/types/context';
import { Request, Response } from 'express';

export interface IAuthServiceLogin {
  email: string;
  password: string;
  context: IContext;
}

export interface IAuthServiceSetRefreshToken {
  id: string;
  req: Request & IAuthUser;
  res: Response;
}

export interface IAuthServiceGetAccessToken {
  id: string;
}
