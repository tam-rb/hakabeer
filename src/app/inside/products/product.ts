export interface IProduct {
    productName: string;
    productCode: string;
    category: string;
    tags?: string[];
    availableDate: string;
    price: number;
    description: string;
    starRating: number;
    imageUrl: string;
    inventory: number
  }
  
  export interface ProductResolved {
    product: IProduct;
    error?: any;
  }

  export interface IOrder{
    id: string;
    dateCreated: string;
    createdby: string;
    total: number;
    table: number;
    active: boolean;
    pax: number;
    items: [IProduct]    
  }