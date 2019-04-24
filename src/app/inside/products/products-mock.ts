import { IProduct } from './product';

export class ProductsMock{
    /**
     * getProducts
     */
    public static getProducts() :IProduct[] {
        return  [
            {
                "productName": "Beer 01",
                "category": "beer",
                "description": "Sản phẩm bia 01",
                "productCode": "B01",
                "price": 12000,
                "starRating": 4,
                "imageUrl": "",
                "availableDate": "20/04/2019",
                "inventory": 10
            },
            {
                "productName": "Beer 02",
                "category": "beer",
                "description": "Sản phẩm bia 02",
                "productCode": "B01",
                "price": 12000,
                "starRating": 3,
                "imageUrl": "",
                "availableDate": "20/04/2019",
                "inventory": 10
            },
            {
                "productName": "Beer 03",
                "category": "beer",
                "description": "Sản phẩm bia 03",
                "productCode": "B01",
                "price": 12000,
                "starRating": 5,
                "imageUrl": "",
                "availableDate": "20/04/2019",
                "inventory": 10
            },
            {
                "productName": "Beer 03",
                "category": "beer",
                "description": "Sản phẩm bia 03",
                "productCode": "B01",
                "price": 12000,
                "starRating": 5,
                "imageUrl": "",
                "availableDate": "20/04/2019",
                "inventory": 10
            }
        ];
    } 
}
