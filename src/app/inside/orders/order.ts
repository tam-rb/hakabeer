import { IProduct } from '../products/product';

export interface IOrder{
    createdDate: string;
    createdby: string;
    table: number;
    close: boolean;
    pax: number;
    total: number;
    items: [IProduct],
    discount: number,
    discountRate: number        
  }

  export interface IPromo{
      name: string,
      startDate: string,
      endDate: string,
      formula: string,
      active: boolean,
      description: string
  }
  