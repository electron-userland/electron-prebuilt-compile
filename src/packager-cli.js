import {execFile} from child_process;

let toRun = path.resolve(require.resolve('electron-compile'), '..', 'packager-cli.js');
execFile(toRun, process.argv.slice(2));
