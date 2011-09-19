window.juration = (function() {
  
  var UNITS = {
    seconds: {
      patterns: ['second', 'sec', 's'],
      value: 1,
      formats: {
        'micro':  's',
        'short':  'sec',
        'long':   'second'
      }
    },
    minutes: {
      patterns: ['minute', 'min', 'm'],
      value: 60,
      formats: {
        'micro':  'm',
        'short':  'min',
        'long':   'minute'
      }
    },
    hours: {
      patterns: ['hour', 'hr', 'h'],
      value: 3600,
      formats: {
        'micro':  'h',
        'short':  'hr',
        'long':   'hour'
      }
    },
    days: {
      patterns: ['day', 'dy', 'd'],
      value: 86400,
      formats: {
        'micro':  'd',
        'short':  'day',
        'long':   'day'
      }
    },
    weeks: {
      patterns: ['week', 'wk', 'w'],
      value: 604800,
      formats: {
        'micro':  'w',
        'short':  'wk',
        'long':   'week'
      }
    },
    months: {
      patterns: ['month', 'mon', 'mo', 'mth'],
      value: 2592000,
      formats: {
        'micro':  'm',
        'short':  'mth',
        'long':   'month'
      }
    },
    years: {
      patterns: ['year', 'yr', 'y'],
      value: 31536000,
      formats: {
        'micro':  'y',
        'short':  'yr',
        'long':   'year'
      }
    }
  };
  
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
      
      var values = {
            years: years,
            months: months,
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: seconds
          },
          output = '';
      
      for(var v in values) {
        if(values[v]) {
          
          var unit = (opts.format === 'micro') ? UNITS[v].formats[opts.format] : pluralize(values[v], UNITS[v].formats[opts.format]);
          
          output += values[v] + (opts.format === 'micro' ? '' : ' ') + unit + ' ';
        }
      }
      
      // trim trailing whitespace and return
      return output.replace(/\s$/, '');
    },
    
    parse: function(string) {
      // returns calculated values separated by spaces
      for(var unit in UNITS) {
        for(var i = 0, mLen = UNITS[unit].patterns.length; i < mLen; i++) {
          var regex = new RegExp("((?:\\d+\\.\\d+)|\\d+)\\s?(" + UNITS[unit].patterns[i] + "s?(?=\\s|\\d|\\b))", 'gi');
          string = string.replace(regex, function(str, p1, p2) {
            return " " + (parseFloat(p1) * UNITS[unit].value).toString() + " ";
          });
        }
      }
      
      var sum = 0,
          numbers = string
                      .replace(/(?!\.)\W+/g, ' ')                       // replaces non-word chars (excluding '.') with whitespace
                      .replace(/^\s+|\s+$|(?:and|plus|with)\s?/g, '')   // trim L/R whitespace, replace known join words with ''
                      .split(' ');
      
      // formats string into array of number
      for(var j = 0, nLen = numbers.length; j < nLen; j++) {
        if(numbers[j] && isFinite(numbers[j])) {
           sum += parseFloat(numbers[j]);
        } else {
          // throw an exception if it's not a valid word/unit
          throw "juration.parse(): Unable to parse: " + numbers[j].replace(/^\d+/g, '');
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