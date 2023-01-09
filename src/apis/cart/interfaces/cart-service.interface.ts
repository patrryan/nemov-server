export interface ICartServiceFindAll {
  id: string;
}

export interface ICartServiceFindOne {
  productId: string;
  id: string;
}

export interface ICartServiceCreate {
  productId: string;
  count: number;
  id: string;
}
