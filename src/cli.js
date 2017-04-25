#!/usr/bin/env node

import electron from 'electron';
import proc from 'child_process';

const signalsToForward = ['SIGTERM', 'SIGINT', 'SIGHUP', 'SIGBREAK'];
let params = [require.resolve('./es6-init')].concat(process.argv.slice(2));

let child = proc.spawn(electron, params, {stdio: 'inherit'});
signalsToForward.forEach((signal) => process.on(signal, () => child.kill(signal)));
child.on('close', (code) => process.exit(code));
