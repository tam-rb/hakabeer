export interface IProduct {
    productName: string;
    productCode: string;
    category: string;
    tags?: string[];
    availableDate: string;
    cost: number;
    price: number;
    pricesix: number;
    priceten: number;
    description: string;
    starRating: number;
    imageUrl: string;
    inventory: number,
    flavor: string,
    odour: string,
    color: string,
    abv: number,
    ibu: number
  }
  
  export interface IProductMin {
    productName: string;
    productCode: string;
    category: string;
    price: number;
    pricesix: number;
    priceten: number;
  }

  export interface ProductResolved {
    product: IProduct;
    error?: any;
  }

