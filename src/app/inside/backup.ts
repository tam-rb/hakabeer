/*
mergeProduct()
  {
    this.productService.getProducts().subscribe((data:IProduct[]) => {  
      this.mergeProductData(data); 
    });
  }

  mergeProductData(data: IProduct[]){
    let prodMinimal = [];
    for(let i =0; i <data.length; i++){
      prodMinimal.push({
        productCode: data[i].productCode,
        productName: data[i].productName, 
        category: data[i].category,   
        price: data[i].price,    
        pricesix: data[i].pricesix,
        priceten: data[i].priceten
      })
    }

    this.orderService.create("productsMin", {products: prodMinimal}, "all");
  }

  mergeDataTest(items){
    //items = [{"category":"blog","id":"586ba9f3a36b129f1336ed38","content":"foo, bar!"},{"category":"blog","id":"586ba9f3a36b129f1336ed3c","content":"hello, world!"},{"category":"music","id":"586ba9a6dfjb129f1332ldab","content":"wow, shamwow!"}];
    var result = items.reduce(function(accumulator, item) {
    var cdate = Utilities.getDate(item.createdDate) as any;
    var current = accumulator.hash[cdate.dateOnlyString];
    
    if(!current) {
      current = accumulator.hash[cdate.dateOnlyString] = { 
        saleDate: cdate.dateOnlyString,
        items: []
      };
      
      accumulator.arr.push(current);
    }

  current.items.push(item);
  
  return accumulator;
}, { hash: {}, arr: [] }).arr;
  
console.log(result);
return result;
}

  mergeOrder(){
    this.orderService.getOrders().subscribe((data:IOrder[]) => {      
      let groupedOrders = this.mergeDataTest(data);
      this.createGroupedOrder(groupedOrders);
    });
  }

  createGroupedOrder(orders : [any]){
    for(let i =0; i < orders.length; i++){
      this.orderService.create("order", {dayOrders: orders[i].items}, orders[i].saleDate);
    }
  } 

  */