const fs = require('fs');
const shell = require('shelljs');
const ItDate = require('./resources/ItDate.js');

// Tests
// require('./tests/ItDateTest.js');

const HOME = shell.exec('runAt.sh HOME').stdout.trim();
let queues = require(`${HOME}/storage/queues.json`);

let data;

const startQ = 102;// f
function getQueue(id) {
	if (!queues) {
		queues = {};	
	}
	if (queues[id] === undefined) {
		queues[id] = String.fromCharCode(startQ + Object.keys(queues).length);
		fs.writeFile(`./storage/queues.json`, JSON.stringify(queues, null, 2));
	}
	return queues[id];	
}

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

function remove(id) {
	if(data[id]) {
		delete data[id];
		shell.exec(`rm ./data/${id}.json`);	
	}
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
	console.log(`RUNNING New Command: ${dKey} @ ${new Date().toString()}`);
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
		console.log(`Command run: ${clt.cmd.alias}\n\t${clt.cmd.value}`);
		shell.exec(clt.cmd.value);
		console.log();
	}
	if (cgt.time) {
		let q = getQueue(dKey);
		clean(q);
		let yyyy = cgt.time.getFullYear();
		let mm = prepend(cgt.time.getMonth() + 1, 2, '0');
		let dd = prepend(cgt.time.getDate(), 2, '0');
		let hh = prepend(cgt.time.getHours(), 2, '0');
		let mi = prepend(cgt.time.getMinutes(), 2, '0');
		let date = `${hh}:${mi}${yyyy}-${mm}-${dd}`;
		let atCmd = `echo "sudo runAt.sh run ${dKey} 1>>/.out.txt 2>>/.out.txt" | at ${date} -q ${q}`;
		console.log(`Next run @${cgt.time.toString()}\n\tPredicted cmd: ${cgt.cmd.alias}`);
		shell.exec(atCmd);
		console.log();
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

function clean(q) {
	const listStr = shell.exec(`sudo atq -q ${q}`).stdout.replace(/([0-9]*).*\n/g, "$1 ");
	shell.exec(`sudo atrm ${listStr}`);
}

function startup() {
	const ids = getDataIds();
	for (let index = 0; index < ids.length; index += 1) {
		runCmd(ids[index]);
	}
}

function exec(process, id) {
	if (process) {
		switch(process.toLowerCase()) {
			case 'run':
				runCmd(id);
				break;
			case 'home':
				console.log(HOME);
				break;
			case 'start':
				startServer();
				break;
			case 'clean':
				clean();
				break;
			case 'startup':
				startup();
				break;
		}
	}
}

loadData();

exec(process.argv[2], process.argv[3]);

exports.exec = exec;
exports.getDataIds = getDataIds;
exports.save = save;
exports.remove = remove;
exports.get = get;
