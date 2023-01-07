import { Request, Response } from 'express';

export interface IAuthUserItem {
  id: string;
}

export interface IAuthUser {
  user?: IAuthUserItem;
}

export interface IContext {
  req: Request & IAuthUser;
  res: Response;
}
