import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import pkg from './package.json' assert { type: 'json' };

// const DIST_PATH =
//   'C:\\Users\\totoraj930\\AppData\\Roaming\\virtu-button\\plugins\\';
// const DIST_PATH = '../v0/temp/plugins/';
const DIST_PATH = './release/';
const DIR_NAME = `discord-${pkg.version}`;

const outfile = path.join(DIST_PATH, DIR_NAME, 'index.cjs');

await build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  outfile,
  platform: 'node',
  target: 'node20',
  loader: {
    '.node': 'copy',
  },
});

const keyfile = path.join(DIST_PATH, DIR_NAME, 'key.json');
const keyJson = {
  clientId: 'CLIENT_IDをここに入力',
  clientSecret: 'CLIENT_SECRETをここに入力',
};
fs.writeFileSync(keyfile, JSON.stringify(keyJson, null, '  '));
