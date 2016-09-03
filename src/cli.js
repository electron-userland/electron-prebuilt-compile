#!/usr/bin/env node

import electron from 'electron';
import proc from 'child_process';

let params = [require.resolve('./es6-init')].concat(process.argv.slice(2));

let child = proc.spawn(electron, params, {stdio: 'inherit'});
child.on('close', (code) => process.exit(code));
