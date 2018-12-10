
const colors = require('colors');

let currFunc;
function assert(assertion) {
  let caller = ((new Error().stack).split("at ")[2]);
  caller = caller.split('(')[0].trim();
  const pre = currFunc ? '\n' : '';
  if (currFunc != caller) {
    currFunc = caller;
    process.stdout.write(`${pre}Running test function: ${currFunc}\n`);
  }
  if (!assertion) {
    throw 'Test Failed... Idk debug yourself';
  }
  process.stdout.write(String.fromCharCode(0x2714).green);
}


exports.assert = assert;