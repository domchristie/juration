window.juration = (function() {

  var MAPPINGS = [
    { units: ['year',   'yr',   'y'], value: 31536000 }, // doesn't account for leap years
    { units: ['month',  'mon',  'mo'],value: 2592000 }, // iterating over month units first prevents 'm' (for minutes) matching 'months'
    { units: ['week',   'wk',   'w'], value: 604800 },
    { units: ['day',    'dy',   'd'], value: 86400 },
    { units: ['hour',   'hr',   'h'], value: 3600 },
    { units: ['minute', 'min',  'm'], value: 60 },
    { units: ['second', 'sec',  's'], value: 1 }
  ];
  
  var pub = {
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
  
  return pub;
})();