namespace Utils_ {
  
  export function round(num: number, fractionDigits?: number): number {
    if (num == null) {
      num = 0;
    }
    if (fractionDigits != null) {
      var rounded = Number(Math.round(new Number(num + 'e' + fractionDigits).valueOf()) + 'e-' + fractionDigits)
      if (isNaN(rounded)) {
        rounded = 0;
      }
      return rounded;
    } else {
      var rounded =  Math.round(num*100)/100;
      return rounded;
    }
  }
  
  export function formatValue_(value: number | string, decimalSeparator: Enums.DecimalSeparator, fractionDigits:number): string {
    
    if (value == null){
        return "";
    } 
    
    if (typeof value == "string") {
      if (value.trim() == '') {
        return "";
      }
      value = parseFloat(value);
    }
    
    if (value == null){
        return "";
    }     

    if(fractionDigits == null) {
      fractionDigits = 2;
    }
    
    var formattedValue = (value.toFixed(fractionDigits)) + "";
    if (decimalSeparator == Enums.DecimalSeparator.DOT) {
      return formattedValue.replace(/\,/g, '.');
    } else {
      return formattedValue.replace(/\./g, ',');
    }
  }
  
  export function convertValueToDate(dateValue: number, offsetInMinutes: number): Date {
    if (dateValue == null) {
      return new Date();
    }
    var year =  dateValue/10000;
    var month =  (dateValue / 100) % 100;
    var day = dateValue % 100;
    var date = createDate(year, month, day, offsetInMinutes);
    return date;
  }
  
  export function isString(obj: object): boolean {
    if (obj == null) {
      return false;
    }
    if (typeof obj === 'string' || obj instanceof String) {
      return true;
    } else {
      return false;
    }
  }
  
  export function createDate(year: number, month: number, day:number, offsetInMinutes: number): Date {
    var date = new Date(year, month - 1, day);
    date.setTime(date.getTime() + offsetInMinutes*60*1000 );    
    return date;
  } 
  
  export function formatDate(date: Date, pattern: string, timeZone: string): string {
    if (date == null || !(date instanceof Date)) {
      return '';
    }
    
    if (timeZone == null || timeZone == "") {
      timeZone = Session.getScriptTimeZone();
    }    
    
    var formatedDate = Utilities.formatDate(date, timeZone, pattern);
    return formatedDate;
  }

  export function getDateFormatterPattern(datePattern: string, periodicity: Enums.Periodicity): string {
    var pattern = datePattern;

    if (periodicity == Enums.Periodicity.MONTHLY) {
      pattern = "MM/yyyy"
    }
    if (periodicity == Enums.Periodicity.YARLY) {
      pattern = "yyyy"
    }
    return pattern;
  }
  
  export function getRepresentativeValue(value: number, credit:boolean): number {
    
    if (value == null) {
      return 0;
    }
    
    if (credit != null && !credit) {
      return value *-1;
    }
    return value;
  }

  export function wrapObjects<E extends Object>(wrapper: E, wrappeds: Array<E>): Array<E> {
    var newObjects = new Array<E>();
    if (wrappeds != null) {
      for (var i = 0; i < wrappeds.length; i++) {
        var newObject = wrapObject(wrapper, wrappeds[i]);
        newObjects.push(newObject);
      }
    }
    return newObjects;
  }
  
  export function wrapObject<E extends Object>(wrapper:E, wrapped:E): E {
    if (wrapped == null) {
      wrapped = new Object() as E;
    }
    var w = Object.create(wrapper);
    w.wrapped = wrapped;
    return w;
  }
  
}

