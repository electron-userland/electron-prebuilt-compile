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
  if (fs.statSyncNoException(ret) && (initScript.startsWith("/") || !path.resolve(path.dirname(ret), '..').match(/[\\\/]node_modules$/i))) {
    return ret;
  }

  return findPackageJson(path.dirname(initScript));
}

function main() {
  const initScript = path.resolve(process.argv[2]);
  const packageJson = findPackageJson(initScript);

  // Reconstitute the original arguments
  const args = process.argv.slice(2);
  process.argv = [process.argv[0]].concat(args);

  //passthrough electron-compile command args if it's specified
  const parsedArgs = require('yargs').alias('c', 'cachedir').alias('s', 'sourcemapdir').argv;
  init(path.dirname(packageJson), initScript, null, parsedArgs.c || null, parsedArgs.s || null);
}

main()
