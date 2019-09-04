export class Utilities {
  static getDate(timestampString: any): object {
        var dateObj = {dateString: "", dateOnlyString: "", day: "", month: "", year:"", hour: "", minute: "", second: ""};

        if(timestampString === undefined || timestampString === ''){
            return dateObj;
        }

        let ts = Number(timestampString);
        
        var dateString = '';
        var date;
        date = new Date(ts);

        let dd = date.getDate();
        let mm = date.getMonth() +1;
        let yyyy = date.getFullYear();
        let h = '' + date.getHours();
        let m = '' + date.getMinutes();
        let s = '' + date.getSeconds();
        
        let D = '' + dd;
        let M = ''+ mm;
        let Y = ''+ yyyy;

        if(dd < 10){
        D = '0' + D;
        }

        if(mm < 10){
        M = '0' + M;
        }
        dateString =  Y + '-' + M + '-' + D + ' ' + h + ":" + m;

        dateObj.dateOnlyString = Y + '-' + M + '-' + D ;
        dateObj.dateString = dateString;
        dateObj.day = D;
        dateObj.month = M;
        dateObj.year = Y;
        dateObj.hour = h;
        dateObj.minute = m;
        dateObj.second = s;
        
        return dateObj;
    }
    

    static getDateString(timestampString : string) : string {
        var dateString = '';
        var billDate;
        if(timestampString === undefined || timestampString === ''){
           billDate = new Date();
        } else {
          billDate = new Date(timestampString);
        }
        
          let dd = billDate.getDate();
          let mm = billDate.getMonth() +1;
          let yyyy = billDate.getFullYear();
          let h = '' + billDate.getHours();
          let m = '' + billDate.getMinutes();
          let s = '' + billDate.getSeconds();
          
          let D = '' + dd;
          let M = ''+ mm;
          let Y = ''+ yyyy;
    
          if(dd < 10){
            D = '0' + D;
          }
    
          if(mm < 10){
            M = '0' + M;
          }
          dateString =  Y + '-' + M + '-' + D + ' ' + h + ":" + m;
        
    
        return dateString;
        }

    static getMonth(timestampString) : string {
        var dateString = '';
        var billDate;
        if(timestampString === undefined || timestampString === ''){
            billDate = new Date();
        } else {
            billDate = new Date(timestampString);
        }            
        
        let mm = billDate.getMonth() +1;
        
    
        return '' + mm;
    }

    static getDay(timestampString) : string {
        var dateString = '';
        var billDate;
        if(timestampString === undefined || timestampString === ''){
            billDate = new Date();
        } else {
            billDate = new Date(timestampString);
        }            
        
        let mm = billDate.getDate();
        
    
        return '' + mm;
    }

    static formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
      try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
    
        const negativeSign = amount < 0 ? "-" : "";
    
        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;
    
        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount -  parseInt(i)).toFixed(decimalCount).slice(2) : "");
      } catch (e) {
        console.log(e);
      }
    }

    static group(items){
      var result = items.reduce(function (accumulator, item) {
        let code = item.product.productCode;
        var current = accumulator.hash[code];
  
        if (!current) {
          current = accumulator.hash[code] = {
            productCode: code,
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
}