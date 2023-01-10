import { Request, Response } from 'express';
import { ROLE_TYPE } from 'src/apis/users/entities/user.entity';

export interface IAuthUserItem {
  id: string;
  role: ROLE_TYPE;
}

export interface IAuthUser {
  user?: IAuthUserItem;
}

export interface IContext {
  req: Request & IAuthUser;
  res: Response;
}
