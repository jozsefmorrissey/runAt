const ItDate = require('../resources/ItDate.js');
const tu = require('../tests/testUtil.js');

function testAllSet() {
  const allSet = new ItDate(1970, 2, 22, 3, 4, 10, 200);
  tu.assert(allSet.getYear() === 70);
  tu.assert(allSet.getMonth() === 2);
  tu.assert(allSet.getDate() === 22);
  tu.assert(allSet.getHours() === 3);
  tu.assert(allSet.getMinutes() === 4);
  tu.assert(allSet.getSeconds() === 10);
  tu.assert(allSet.getMilliseconds() === 200);
}

function testNoneSet() {
  const noneSet = new ItDate(null, null, null, null, null, null, null);
  tu.assert(noneSet.getYear() === null);
  tu.assert(noneSet.getDate() === null);
  tu.assert(noneSet.getMonth() === null);
  tu.assert(noneSet.getHours() === null);
  tu.assert(noneSet.getMinutes() === null);
  tu.assert(noneSet.getSeconds() === null);
  tu.assert(noneSet.getMilliseconds() === null);
}

function testStringDaySet() {
  const daySet = new ItDate(1970, null, 'tuesDay', 1, null, 1);
  tu.assert(daySet.getDay() === 2);
  tu.assert(daySet.getDate() === null);
}

function testCmpDates() {
  const oneOne = new Date(1, 0, 1, 0, 0, 0, 0);
  const cmpDates = [{
  	 flexible: new ItDate(null, 7, 1, 0, 0, 0, 0),
  	 target: oneOne,
    returned: new Date(0, 7, 1, 0, 0, 0, 0),
    before: new Date(0, 7, 1, 0, 0, 0, 0),
    after: new Date(1, 7, 1, 0, 0, 0, 0),
  },{
  	 flexible: new ItDate(null, 4, 1, 0, 0, 0, 0),
  	 target: oneOne,
    returned: new Date(1, 4, 1, 0, 0, 0, 0),
    before: new Date(0, 4, 1, 0, 0, 0, 0),
    after: new Date(1, 4, 1, 0, 0, 0, 0),
  },{
  	 flexible: new ItDate(null, null, 14, 0, 0, 0, 0),
  	 target: oneOne,
    returned: new Date(1, 0, 14, 0, 0, 0, 0),
    before: new Date(0, 11, 14, 0, 0, 0, 0),
    after: new Date(1, 0, 14, 0, 0, 0, 0),
  },{
  	 flexible: new ItDate(null, null, 18, 0, 0, 0, 0),
  	 target: oneOne,
    returned: new Date(0, 11, 18, 0, 0, 0, 0),
    before: new Date(0, 11, 18, 0, 0, 0, 0),
    after: new Date(1, 0, 18, 0, 0, 0, 0),
  },{
  	 flexible: new ItDate(null, null, null, 11, 0, 0, 0),
  	 target: oneOne,
    returned: new Date(1, 0, 1, 11, 0, 0, 0),
    before: new Date(0, 11, 31, 11, 0, 0, 0),
    after: new Date(1, 0, 1, 11, 0, 0, 0),
  },{
  	 flexible: new ItDate(null, null, null, 14, 0, 0, 0),
  	 target: oneOne,
    returned: new Date(0, 11, 31, 14, 0, 0, 0),
    before: new Date(0, 11, 31, 14, 0, 0, 0),
    after: new Date(1, 0, 1, 14, 0, 0, 0),
  }];
  for (let index = 0; index < cmpDates.length; index += 1) {
    const dObj = cmpDates[index];
    let sDist = dObj.flexible.closest(dObj.target);
    tu.assert(!(sDist > dObj.returned) && !(sDist < dObj.returned));
    
    sDist = dObj.flexible.closestLT(dObj.target);
    tu.assert(!(sDist > dObj.before) && !(sDist < dObj.before));
    
    sDist = dObj.flexible.closestGT(dObj.target);
    tu.assert(!(sDist > dObj.after) && !(sDist < dObj.after));
  }
}

function testStringDay() {
  const oneOne = new Date(1, 0, 1, 0, 0, 0, 0);
  const cmpDates = [{
  	 flexible: new ItDate(null, null, 'wednesday', 0, 0, 0, 0),
  	 target: oneOne,
    returned: new Date(1, 0, 2, null, 0, 0, 0),
    before: new Date(0, 11, 26, null, 0, 0, 0),
    after: new Date(1, 0, 2, 0, null, 0, 0),
  }];
  for (let index = 0; index < cmpDates.length; index += 1) {
    const dObj = cmpDates[index];
    let sDist = dObj.flexible.closest(dObj.target);
    tu.assert(!(sDist > dObj.returned) && !(sDist < dObj.returned));

    sDist = dObj.flexible.closestLT(dObj.target);
    tu.assert(!(sDist > dObj.before) && !(sDist < dObj.before));
    
    sDist = dObj.flexible.closestGT(dObj.target);
    tu.assert(!(sDist > dObj.after) && !(sDist < dObj.after));
  }
}

function testItDate() {
  testAllSet();
  testNoneSet();
  testStringDaySet();
  testCmpDates();
  testStringDay();

  console.log('\n');
  return "Success!";
}

testItDate();
