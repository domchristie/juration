window.juration = (function() {

  var MAPPINGS = [
    { units: ['year',   'yr',   'y'], value: 31536000 }, // doesn't account for leap years
    { units: ['month',  'mon',  'mo'],value: 2592000 }, // iterating over month units first prevents 'm' (for minutes) matching 'months'
    { units: ['day',    'dy',   'd'], value: 86400 },
    { units: ['hour',   'hr',   'h'], value: 3600 },
    { units: ['minute', 'min',  'm'], value: 60 },
    { units: ['second', 'sec',  's'], value: 1 },
    { units: ['week',   'wk',   'w'], value: 604800 } // minutes aren't used when stringifying so keep as last
  ];
  
  var pub = {
    
    stringify: function(seconds, options) {
      
      var opts = {
        format: (options && options.format) ? options.format : 'short'
      };
      
      var years, months, days, hours, minutes;
          
      if(seconds >= 60) {
        minutes = parseInt(seconds / 60, 10);
        seconds = seconds % 60;
        
        if(minutes >= 60) {
          hours = parseInt(minutes / 60, 10);
          minutes = minutes % 60;
          
          if(hours >= 24) {
            days = parseInt(hours / 24, 10);
            hours = hours % 24;
            
            if(days >= 30) {
              months = parseInt(days / 30, 10);
              days = days % 30;
              
              if(months >= 12) {
                years = parseInt(months / 12, 10);
                months = months % 12;
              }
            }
          }
        }
      }
      
      var values = [years, months, days, hours, minutes],
          output = '',
          formatCode;
      
      // Converts format string to code to be used with MAPPINGS[i].units
      switch(opts.format) {
        case 'micro':
          formatCode = 2;
          break;
        case 'short':
          formatCode = 1;
          break;
        case 'long':
          formatCode = 0;
          break;
      }
      
      for(var i = 0, len = values.length; i < len; i++) {
        if(values[i]) {
          var unit = (opts.format === 'micro') ? MAPPINGS[i].units[formatCode] : pluralize(values[i], MAPPINGS[i].units[formatCode]);
          
          output += values[i] + unit;
          
          if(opts.format !== 'micro') {
            output += " ";
          }
        }
      }
      
      // trim trailing whitespace and return
      return output.replace(/\s$/, '');
    },
    
    parse: function(string) {
      for(var i = 0, mLen = MAPPINGS.length; i < mLen; i++) {
        for(var j = 0, uLen = MAPPINGS[i].units.length; j < uLen; j++) {
          var regex = new RegExp("((?:\\d+\\.\\d+)|\\d+)\\s?(" + MAPPINGS[i].units[j] + ")s?(?:\\b)?", 'gi');
          string = string.replace(regex, function(str, p1, p2) {
            return (parseFloat(p1) * MAPPINGS[i].value).toString() + " ";
          });
        }
      }
      var sum = 0,
          numbers = string.replace(/(?!\.)\D+/g, ' ').replace(/\s$/g, '').split(' ');
      for(i = 0, nLen = numbers.length; i < nLen; i++) {
        if(numbers[i]) {
           sum += parseFloat(numbers[i]);
        }
      }
      return sum;
    }
  };
  
  pluralize = function(count, singular) {
    return count == 1 ? singular : singular + "s";
  };
  
  return pub;
})();