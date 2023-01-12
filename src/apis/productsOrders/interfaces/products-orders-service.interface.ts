import { User } from 'src/apis/users/entities/user.entity';
import { CreateProductOrderInput } from '../dto/create-product-order.input';

interface IProductToBuy {
  id: string;
  discountedPrice: number;
  quantity: number;
  user: { id: string; point: number };
  count: number;
}

export interface FindAllByBuyer {
  startDate: Date;
  endDate: Date;
  page: number;
  id: string;
}

export interface FindAllCountByBuyer {
  startDate: Date;
  endDate: Date;
  id: string;
}

export interface FindAllCountOfBought {
  id: string;
}

export interface FindAllBySeller {
  startDate: Date;
  endDate: Date;
  page: number;
  id: string;
}

export interface FindAllCountBySeller {
  startDate: Date;
  endDate: Date;
  id: string;
}

export interface FindAllWithoutReview {
  page: number;
  id: string;
}

export interface FindAllCountWithoutReview {
  id: string;
}

export interface VerifyForPurchase {
  productOrders: CreateProductOrderInput[];
  amount: number;
  id: string;
}

export interface Create {
  productOrders: CreateProductOrderInput[];
  amount: number;
  id: string;
}

export interface CreateProductOrder {
  productToBuy: IProductToBuy;
  buyer: User;
}

export interface CancelOrder {
  productOrderId: string;
  id: string;
}

export interface ValidateForCancel {
  productOrderId: string;
  id: string;
}
