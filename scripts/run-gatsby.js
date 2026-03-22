const { spawn } = require('child_process');
const path = require('path');

const isWindows = process.platform === 'win32';
const gatsbyBin = path.join(
  __dirname,
  '..',
  'node_modules',
  '.bin',
  isWindows ? 'gatsby.cmd' : 'gatsby',
);

const gatsbyArgs = process.argv.slice(2);

const env = {
  ...process.env,
  NODE_OPTIONS: [
    process.env.NODE_OPTIONS,
    '--openssl-legacy-provider',
    '--no-deprecation',
    '--require',
    './scripts/node-preload.js',
  ]
    .filter(Boolean)
    .join(' '),
  GATSBY_TELEMETRY_DISABLED: '1',
};

const child = isWindows
  ? spawn('cmd.exe', ['/c', gatsbyBin, ...gatsbyArgs], {
      stdio: 'inherit',
      shell: false,
      env,
    })
  : spawn(gatsbyBin, gatsbyArgs, {
      stdio: 'inherit',
      shell: false,
      env,
    });

child.on('exit', code => {
  process.exit(code ?? 0);
});
