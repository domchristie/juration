Juration.js
========

A simple natural language duration parser written in javascript. Time ranges (in seconds) can also be converted to human readable strings. Check out the [demo](http://domchristie.github.com/juration).

Inspired by [chronic](https://github.com/mojombo/chronic/), and [chronic_duration](https://github.com/hpoydar/chronic_duration).

Usage
-----

### Parsing

    juration.parse("3mins 5secs"); // returns 185

### Stringifying
    
    juration.stringify(185); // returns "3 mins 5 secs"
    juration.stringify(185, { format: 'small' }); // returns "3 mins 5 secs"
    juration.stringify(185, { format: 'micro' }); // returns "3m 5s"
    juration.stringify(185, { format: 'long' });  // returns "3 minutes 5 seconds"

Examples
--------
Parse-able strings:

* 12.4 secs
* 3 mins 4 sec
* 2 hrs 20 min
* 2h20min
* 6 mos 1 day
* 47 yrs 6 mos and 4d
* 3 weeks and 2 days

Todo
----
* Add customisable default unit option, e.g. `juration.parse("10", { defaultUnit: 'minutes' }) // returns 600`
* Parse chrono format i.e. hh:mm:ss

Licence
-------
Juration is copyright &copy; 2011 [Dom Christie](http://domchristie.co.uk) and released under the MIT license.