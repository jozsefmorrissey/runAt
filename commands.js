const fs = require('fs');
const shell = require('shelljs');
const ItDate = require('./resources/ItDate.js');

// Tests
// require('./tests/ItDateTest.js');

const HOME = shell.exec('runAt.sh HOME').stdout.trim();

let data;
loadData();

function iterate(func) {
	for (let index = 0; index < this.length; index += 1) {
		func.call(this[index], index);			
	}		
}

function iterateObj(func) {
	const keys = Object.keys(this);
	for (let index = 0; index < keys.length; index ++ ){
		const key = keys[index];
		func.call(this[key], key);
	}
}

function get(id) {
  if (data[id] === undefined) {
    try {
      data[id] = require(`./data/${id}.json`);
    } catch (e) {
      data[id] = [];
    }
  }
  return data[id];
}

function save(id, obj) {
  data[id] = obj;
  fs.writeFile(`./data/${id}.json`, JSON.stringify(data[id], null, 2));
  exec('run', id);
}
	
Array.prototype.each = iterate;		
Object.prototype.each = iterateObj;

function getDataIds() {
  const rawIds = shell.ls(`${HOME}/data/`);
  const ids = [];
  for (let index = 0; index < rawIds.length; index += 1) {
    const id = rawIds[index];
    if (id.lastIndexOf('.json') === id.length - 5) {
    	ids.push(id.substr(0, id.lastIndexOf('.json')));
    }
  }
  return ids;
}

function loadData() {
	data = {};
	const dataIds = getDataIds();
	for (let index = 0; index < dataIds.length; index += 1) {
		const id = dataIds[index];
		const fp = `${HOME}/data/${id}.json`;
		const contents = fs.readFileSync(fp, 'utf-8');
		console.log(id, fp);
		console.log("cont: " + contents);
		data[id] = JSON.parse(contents);
	}
}

function prepend(str, len, preFixChar) {
	str = str.toString();
	while (str.length < len) {
		str = preFixChar + str;
	}
	return str;
}

function runCmd (dKey) {
	const cmds = {};
	let cgt = {};
	let clt = {};
	const now = new Date();
	for (let cIndex = 0; cIndex < data[dKey].length; cIndex += 1) {		
		let cmd = data[dKey][cIndex];
		cmd.times.each(function(tKey) {
			this.each (function () {
				const currCgt = new ItDate(this).closestGT(new Date(now));
				const currClt = new ItDate(this).closestLT(new Date(now));
				if (!cgt.time || cgt.time > currCgt) {
					cgt.time = currCgt;
					cgt.cmd = cmd;
				}
				if (!clt.time || clt.time < currClt) {
					clt.time = currClt;
					clt.cmd = cmd;
				}
			});
		});
	}
	
	if (clt.cmd) {
		shell.exec(clt.cmd.value);
	}
	if (cgt.time) {
		let yyyy = cgt.time.getFullYear();
		let mm = prepend(cgt.time.getMonth() + 1, 2, '0');
		let dd = prepend(cgt.time.getDate(), 2, '0');
		let hh = prepend(cgt.time.getHours(), 2, '0');
		let mi = prepend(cgt.time.getMinutes(), 2, '0');
		let date = `${hh}:${mi}${yyyy}-${mm}-${dd}`
		let atCmd = `echo ${HOME}commands.js run ${dKey} | at ${date}`;
		console.log(atCmd);
		shell.exec(atCmd);
	}
	
	return {cgt, clt};
}

function startServer() {
	
	const found = shell.exec('netstat -plten | grep 3000').stdout.indexOf('(') == 0;
	if (!found) {
		console.log('starting');
		shell.cd(HOME);
		shell.exec(`node ./index.js`, {async: true});	
	} else {
		console.log('already running');	
	}
	shell.exec('chromium-browser http://localhost:3000/res/modify.html');
}


function exec(process, id) {
	if (process) {
		switch(process.toLowerCase()) {
			case 'run':
				console.log(runCmd(id));
				break;
			case 'home':
				console.log(HOME);
				break;
			case 'start':
				startServer();
				break;
		}
	}
}

exec(process.argv[2], process.argv[3]);

exports.exec = exec;
exports.getDataIds = getDataIds;
exports.save = save;
exports.get = get;
