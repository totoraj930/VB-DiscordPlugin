import dotenv from 'dotenv';
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import pkg from './package.json' assert { type: 'json' };

dotenv.config();

const isDev = process.argv.includes('--dev');

let DIST_PATH = './release/';
const DIR_NAME = `discord-${pkg.version}`;

if (isDev) {
  DIST_PATH = process.env.DEV_DIST ?? DIST_PATH;
}

fs.rmSync(path.join(DIST_PATH, DIR_NAME), { force: true, recursive: true });

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
if (isDev) {
  keyJson.clientId = process.env.DEV_CLIENT_ID ?? '';
  keyJson.clientSecret = process.env.DEV_CLIENT_SECRET ?? '';
}
fs.writeFileSync(keyfile, JSON.stringify(keyJson, null, '  '));

console.log('Build finished!', path.join(DIST_PATH, DIR_NAME));
