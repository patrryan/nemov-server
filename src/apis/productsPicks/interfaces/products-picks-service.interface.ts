export interface IProductsPicksServiceFindAllByUser {
  page: number;
  id: string;
}

export interface IProductsPicksServiceFindAllCountByUser {
  id: string;
}

export interface IProductsPicksServiceFindOneByUser {
  productId: string;
  id: string;
}

export interface IProductsPicksServiceFindAllCountByProduct {
  productId: string;
}

export interface IProductsPicksServiceCreate {
  productId: string;
  id: string;
}
