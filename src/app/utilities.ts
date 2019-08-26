export class Utilities {
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
}