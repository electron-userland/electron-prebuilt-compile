import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import {init} from 'electron-compile';

function findPackageJson(initScript) {
  if (initScript === '/' || initScript.match(/^[A-Za-z]:$/)) {
    throw new Error("Can't find package.json");
  }

  // Walk up the parent directories until we find package.json. Make sure that
  // we're not actually stumbling upon a parent npm package
  let ret = path.join(initScript, 'package.json')
  if (fs.statSyncNoException(ret) && !path.resolve(path.dirname(ret), '..').match(/[\\\/]node_modules$/i)) {
    return ret;
  }

  return findPackageJson(path.dirname(initScript));
}

/**
 * Some debugger environment reconstruct process argument and inject args ignoring original order,
 * extract to find out right path for init script.
 *
 */
function getInitScriptPath() {
  const rawArgv = process.argv.filter((x) => x.indexOf(`--inspect=`) === -1 && x.indexOf(`--debug-brk`))[2];
  return path.resolve(rawArgv);
}

function main() {
  const initScript = getInitScriptPath();
  const packageJson = findPackageJson(initScript);
  const appPath = path.dirname(packageJson);
  const packageJsonData = JSON.parse(fs.readFileSync(packageJson, 'utf8'));

  app.setName(packageJsonData.productName || packageJsonData.name);
  app.setVersion(packageJsonData.version);
  app.setAppPath(appPath);

  // Reconstitute the original arguments
  const args = process.argv.slice(2);
  process.argv = [process.argv[0]].concat(args);

  //passthrough electron-compile command args if it's specified
  const parsedArgs = require('yargs').alias('c', 'cachedir').alias('s', 'sourcemapdir').argv;
  init(path.dirname(packageJson), initScript, null, parsedArgs.c || null, parsedArgs.s || null);
}

main()
