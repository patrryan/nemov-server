export interface CartServiceFindAll {
  id: string;
}

export interface CartServiceFindOne {
  productId: string;
  id: string;
}

export interface CartServiceCreate {
  productId: string;
  count: number;
  id: string;
}

export interface CartServiceFindAllCount {
  id: string;
}

export interface CartServiceDelete {
  productId: string;
  id: string;
}
