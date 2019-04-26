import { IProduct } from '../products/product';

export interface IOrder{
    id: string;
    createdDate: string;
    createdby: string;
    table: number;
    active: boolean;
    pax: number;
    total: number;
    items: [IProduct],
    promo: IPromo    
  }

  export interface IPromo{
      name: string,
      startDate: string,
      endDate: string,
      formula: string,
      active: boolean,
      description: string
  }