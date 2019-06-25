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
    inventory: number,
    flavor: string,
    odour: string,
    color: string,
    abv: number,
    ibu: number
  }
  
  export interface ProductResolved {
    product: IProduct;
    error?: any;
  }

