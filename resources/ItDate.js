// Here You can type your custom JavaScript...

function ItDate(_year, _month, _day, _hour, _min, _sec, _milli) {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  let year, month, day, hour, min, sec, milli;

  if (_year && typeof _year === 'object') {
    year = _year.year;
    month = _year.month;
    day = _year.day;
    hour = _year.hour;
    min = _year.min;
    sec = _year.sec;
    milli = _year.milli;
  } else {
    year = _year;
    month = _month;
    day = _day;
    hour = _hour;
    min = _min;
    sec = _sec;
    milli = _milli;
  }

  let numDay = day;
  if (typeof day === 'string' || day === null) {
    numDay = 1;
  }

  const date = new Date(year, month, numDay, hour, min, sec, milli);

  this.getDate = function() {
    if (typeof day === 'number') {
      return date.getDate();
    }
    return null;
  };
  
  this.getDay = function() {
    if (typeof day === 'string') {
      return days.indexOf(day.toLowerCase());
    }
    if (day === null) {
      return null;
    }
    return date.getDay();
  };
  
  this.getFullYear = function() {
    if (year !== null) {
      return date.getFullYear();
    }
    return null;
  };
  
  this.getHours = function() {
    if (hour !== null) {
      return date.getHours();
    }
    return null;
  };
  
  this.getMilliseconds = function() {
    if (milli !== null) {
      return date.getMilliseconds();
    }
    return null;
  };
  
  this.getMinutes = function() {
    if (min !== null) {
      return date.getMinutes();
    }
    return null;
  
  };
  
  this.getMonth = function() {
    if (month !== null) {
      return date.getMonth();
    }
    return null;
  };
  
  this.getSeconds = function() {
  if (sec !== null) {
      return date.getSeconds();
    }
    return null;
  };
  
  this.getTime = function() {
      if (year !== null && month !== null && day !== null && hour !== null && 
          min !== null && sec !== null) {
      return date.getTime();
    }
    return null;
  };
  
  // TODO: Not sure how null values should effect this function.
  this.getTimezoneOffset = function() {
    return date.getTimezoneOffset();
  };
  
  this.getUTCDate = function() {
    if (typeof day === 'number') {
      return date.getUTCDate();
    }
    return null;
  };
  
  this.getUTCDay = function() {
    if (typeof day === 'string') {
      return days.indexOf(day.toLowerCase())
    }
    if (day === null) {
      return null;
    }
    return date.getUTCDay();
  };
  
  this.getUTCFullYear = function() {
    if (year !== null) {
      return date.getUTCFullYear();
    }
    return null;
  };
  
  this.getUTCHours = function() {
    if (hour !== null) {
      return date.getUTCHours();
    }
    return null;
  };
  
  this.getUTCMilliseconds = function() {
    if (milli !== null) {
      return date.getUTCMilliseconds();
    }
    return null;
  };
  
  this.getUTCMinutes = function() {
    if (min !== null) {
      return date.getUTCMinutes();
    }
    return null;
  };
  
  this.getUTCMonth = function() {
    if (month !== null) {
      return date.getUTCFullYear();
    }
    return month;
  };
  
  this.getUTCSeconds = function() {
    if (sec !== null) {
      return date.getUTCSeconds();
    }
    return null;
  };

  this.getYear = function() {
    if (year !== null) {
      return date.getYear();
    }
    return year;
  };
   
  this.now = function() {
    return date.now();
  };
  
  this.parse = date.parse;
  
  this.setDate = function(d) {
    day = d;
    date.setDate(d);
  };
  
  this.setFullYear = function(y) {
    year = y;
    date.setFullYear(y);
  };
  
  this.setHours = function(h) {
    hour = h;
    date.setHours(h);
  };
  
  this.setMilliseconds = function(ms) {
    milli = ms;
    date.setMilliseconds(ms);
  };
  
  this.setMinutes = function(m) {
    min = m;
    date.setMinutes(m);
  };
  
  this.setMonth = function(m) {
    month = m;
    date.setMonth(m);
  };
  
  this.setSeconds = function(s) {
    sec = s;
    date.setSeconds(s);
  };
  
  this.setTime = function(ms) {
    date.setTime(ms);
  };
  
  this.setUTCDate = function(d) {
    day = d;
    date.setUTCDate(d);
  };
  
  this.setUTCFullYear = function(y) {
    year = y;
    date.setUTCFullYear(y);
  };

  this.setUTCHours = function(h) {
    hour = h;
    date.setUTCHours(h);
  };

  this.setUTCMilliseconds = function(ms) {
    milli = ms;
    date.setUTCMilliseconds(ms);
  };

  this.setUTCMinutes = function(m) {
    min = m;
    date.setUTCMinutes(m);
  };

  this.setUTCMonth = function(m) {
    month = m;
    date.setUTCMonth(m);
  };

  this.setUTCSeconds = function(s) {
    sec = s;
    date.setUTCSeconds(s);
  };

  this.setYear = function(y) {
    year = y;
    date.setYear(y);
  };

  this.toDateString = date.toDateString;

  this.toGMTString = date.toGMTString;

  this.toISOString = date.toISOString;

  this.toJSON = date.toJSON;

  this.toLocaleDateString = date.toLocaleDateString;

  this.toLocaleTimeString = date.toLocaleTimeString;

  this.toLocaleString = date.toLocaleString;

  // TODO: fix all the other non wrapped date functions;
  this.toString = function () {return date.toString()};

  this.toTimeString = date.toTimeString;

  this.toUTCString = date.toUTCString;

  this.UTC = date.UTC;

  this.valueOf = date.valueOf;
  
  function priority(one, two) {
    if(one !== null ) {
      return one;    
    }
    return two;
  }
  
  function possibilities(flexible, target, edgeCases) {
    if (target === null && flexible === null) {
		return [undefined];
    }
    if (target === null || flexible !== null) {
	      return [flexible];
    }
    if (flexible === null) {
    	if (edgeCases) {
	      return [target, target + 1, target - 1].concat(edgeCases);
	   } else {
	      return [target, target + 1, target - 1];
	   }
    }
  }

  // Jacked from: https://eddmann.com/posts/cartesian-product-in-javascript/
  const flatten = (arr) => [].concat.apply([], arr);

  const cartesianProductOf = (...sets) =>
    sets.reduce((acc, set) =>
      flatten(acc.map(x => set.map(y => [ ...x, y ]))),
    [[]]);
  
  this.isValid = function (date) {
	const year = this.getYear();
	if (year && date.getYear() !== year) {
		return false;
	}
	const month = this.getMonth();
	if (month && date.getMonth() !== month) {
		return false;
	}
	const d = this.getDate();
	if (d && date.getDate() !== d) {
		return false;
	}
	const hour = this.getHours();
	if (hour && date.getHours() !== hour) {
		return false;
	}
	const min = this.getMinutes();
	if (min && date.getMinutes() !== min) {
		return false;
	}
	const sec = this.getSeconds();
	if (sec && date.getSeconds() !== sec) {
		return false;
	}
	const mil = this.getMilliseconds();
	if (mil && date.getMilliseconds() !== mil) {
		return false;
	}
	return true;
  }
  
  // Use apply(this, [ARGS]) to call this function no need
  // for the end user to see it.
  function datePossibilities(target, edgeCases) {
    if (typeof day !== 'string') {
      return possibilities(this.getDate(), target.getDate(), edgeCases);    
    }
    

    let str = this.toString();
    let middle = new Date(target);
    while (this.getDay() != middle.getDay()) {
		middle.setDate(middle.getDate() + 1);    
    }
    
    const d = middle.getDate();
    return [d - 7, d, d + 7];
  }
  
  this.closest = function (target, cmp) {
  	 cmp = cmp ? cmp : function(){return true;};
    const year = possibilities(this.getFullYear(), target.getFullYear());
    const mon = possibilities(this.getMonth(), target.getMonth(), [0, 11]);
    const date = datePossibilities.apply(this, [target, [1, 28, 31, 30]]);
    const hour = possibilities(this.getHours(), target.getHours(), [0, 23]);
    const min = possibilities(this.getMinutes(), target.getMinutes(), [0, 59]);
    const sec = possibilities(this.getSeconds(), target.getSeconds(), [0, 59]);
    const mil = possibilities(this.getMilliseconds(), target.getMilliseconds(), [0, 999]);

    const argSets = cartesianProductOf(year, mon, date, hour, min, sec, mil);
    let closest;
    for (let index = 0; index < argSets.length; index += 1) {
	   const d = new Date(...argSets[index]);
	   if (this.isValid(d) && cmp(target, d) &&
	   		(closest === undefined || Math.abs(d - target) < Math.abs(closest - target))) {
			closest = d;	   
	   }
    }
    return closest;
  }
 
  this.closestGT = function (target) {
 	return this.closest(target, function (target, d){return target < d});
  }
  this.closestLT = function (target) {
  	return this.closest(target, function (target, d){return target > d});
  }

  this.toObj = function () {
    return {year, month, day, hour, min, sec, milli};  
  }
}

module.exports = ItDate;
