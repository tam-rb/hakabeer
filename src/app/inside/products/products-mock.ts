import { IProduct } from './product';

export class ProductsMock{
    /**
     * getProducts
     */
    public static getProducts() :IProduct[] {
        return  [
            {
                "productId": 1,
                "productName": "Beer 01",
                "category": "beer",
                "description": "Sản phẩm bia 01",
                "productCode": "B01",
                "price": 12000,
                "starRating": 4,
                "imageUrl": "",
                "releaseDate": "20/04/2019",
                "stock": 10
            },
            {
                "productId": 2,
                "productName": "Beer 02",
                "category": "beer",
                "description": "Sản phẩm bia 02",
                "productCode": "B01",
                "price": 12000,
                "starRating": 3,
                "imageUrl": "",
                "releaseDate": "20/04/2019",
                "stock": 10
            },
            {
                "productId": 3,
                "productName": "Beer 03",
                "category": "beer",
                "description": "Sản phẩm bia 03",
                "productCode": "B01",
                "price": 12000,
                "starRating": 5,
                "imageUrl": "",
                "releaseDate": "20/04/2019",
                "stock": 10
            },
            {
                "productId": 4,
                "productName": "Beer 04",
                "category": "beer",
                "description": "Sản phẩm bia 04",
                "productCode": "B01",
                "price": 12000,
                "starRating": 4.5,
                "imageUrl": "",
                "releaseDate": "20/04/2019",
                "stock": 10
            }
        ];
    } 
}
