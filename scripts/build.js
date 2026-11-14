const { spawnSync } = require('child_process');
const path = require('path');

const majorVersion = parseInt(process.versions.node.split('.')[0], 10);
const env = { ...process.env };

if (majorVersion >= 17 && !(env.NODE_OPTIONS || '').includes('--openssl-legacy-provider')) {
  env.NODE_OPTIONS = `${env.NODE_OPTIONS ? `${env.NODE_OPTIONS} ` : ''}--openssl-legacy-provider`;
}

const bin = path.resolve(__dirname, '../node_modules/.bin/react-scripts');
const result = spawnSync(bin, ['build'], {
  stdio: 'inherit',
  env,
  shell: process.platform === 'win32',
});

process.exit(result.status ?? 1);
