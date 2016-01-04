import fs from 'fs';
import path from 'path';
import {init} from 'electron-compile';

function findPackageJson(initScript) {
  if (initScript === '/' || initScript.match(/^[A-Za-z]:$/)) {
    throw new Error("Can't find package.json");
  }

  // Walk up the parent directories until we find package.json
  let ret = path.join(initScript, 'package.json')
  if (fs.statSyncNoException(ret)) return ret;

  return findPackageJson(path.dirname(initScript));
}

function main() {
  let initScript = path.resolve(process.argv[2]);
  let packageJson = findPackageJson(initScript);

  // Reconstitute the original arguments
  let args = process.argv.slice(2);
  process.argv = [process.argv[0]].concat(args);
  
  init(path.dirname(packageJson), initScript)
}

main()
