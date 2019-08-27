export class Utilities {
  static getDate(timestampString: any): object {
        
        var dateObj = {dateString: "", dateOnlyString: "", day: "", month: "", year:"", hour: "", minute: "", second: ""};

        if(timestampString === undefined || timestampString === ''){
            return dateObj;
        }
        

        var dateString = '';
        var date;
        date = new Date(timestampString);

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
    

    static getDateString(timestampString) : string {
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
}