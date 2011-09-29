/*
 * juration - a natural language duration parser
 * https://github.com/domchristie/juration
 *
 * Copyright 2011, Dom Christie
 * Licenced under the MIT licence
 *
 */
 
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
      patterns: ['minute', 'min', 'm(?!s)'],
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
    
  var stringify = function(seconds, options) {
    
    if(!_isNumeric(seconds)) {
      throw "juration.stringify(): Unable to stringify a non-numeric value";
    }
    
    var defaults = {
      format: 'short'
    };
    
    var opts = _extend(defaults, options);
    
    var units = ['years', 'months', 'days', 'hours', 'minutes', 'seconds'], values = [];
    for(var i = 0, len = units.length; i < len; i++) {
      if(i === 0) {
        values[i] = parseInt(seconds / UNITS[units[i]].value, 10);
      }
      else {
        values[i] = parseInt((seconds % UNITS[units[i-1]].value) / UNITS[units[i]].value, 10);
      }
      if(opts.format === 'micro') {
        values[i] += UNITS[units[i]].formats[opts.format];
      }
      else {
        values[i] += ' ' + _pluralize(values[i], UNITS[units[i]].formats[opts.format]);
      }
    }
    var output = '';
    for(i = 0, len = values.length; i < len; i++) {
      if(values[i].charAt(0) !== "0") {
        output += values[i] + ' ';
      }
    }
    return output.replace(/\s+$/, '');
  };
  
  var parse = function(string) {
    
    // returns calculated values separated by spaces
    for(var unit in UNITS) {
      for(var i = 0, mLen = UNITS[unit].patterns.length; i < mLen; i++) {
        var regex = new RegExp("((?:\\d+\\.\\d+)|\\d+)\\s?(" + UNITS[unit].patterns[i] + "s?(?=\\s|\\d|\\b))", 'gi');
        string = string.replace(regex, function(str, p1, p2) {
          return " " + (p1 * UNITS[unit].value).toString() + " ";
        });
      }
    }
    
    var sum = 0,
        numbers = string
                    .replace(/(?!\.)\W+/g, ' ')                       // replaces non-word chars (excluding '.') with whitespace
                    .replace(/^\s+|\s+$|(?:and|plus|with)\s?/g, '')   // trim L/R whitespace, replace known join words with ''
                    .split(' ');
    
    for(var j = 0, nLen = numbers.length; j < nLen; j++) {
      if(numbers[j] && isFinite(numbers[j])) {
         sum += parseFloat(numbers[j]);
      } else if(!numbers[j]) {
        throw "juration.parse(): Unable to parse: a falsey value";
      } else {
        // throw an exception if it's not a valid word/unit
        throw "juration.parse(): Unable to parse: " + numbers[j].replace(/^\d+/g, '');
      }
    }
    return sum;
  };
  
  var _pluralize = function(count, singular) {
    return count == 1 ? singular : singular + "s";
  };
  
  var _isNumeric = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };
  
  var _extend = function(obj, extObj) {
    for (var i in extObj) {
      obj[i] = extObj[i];
    }
    return obj;
  };
  
  return {
    parse: parse,
    stringify: stringify,
    humanize: stringify
  };
})();