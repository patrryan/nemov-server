import { User } from 'src/apis/users/entities/user.entity';

export interface IPointsServiceFindAllByUser {
  startDate?: Date;
  endDate?: Date;
  page: number;
  id: string;
}

export interface IPointsServiceFindAllCountByUser {
  startDate?: Date;
  endDate?: Date;
  id: string;
}

export interface IPointsServiceCreatePointCharge {
  impUid: string;
  amount: number;
  id: string;
}

export interface IPointsServiceValidateForPointCharge {
  impUid: string;
  amount: number;
}

export interface IPointsServiceCancelPointCharge {
  impUid: string;
  id: string;
}

export interface IPointsServiceValidateForPointRefund {
  impUid: string;
  id: string;
}

export interface IPointsServiceValidateForPointRefundReturn {
  amount: number;
  user: User;
}
