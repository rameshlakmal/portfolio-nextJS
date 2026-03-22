const { spawn } = require('child_process');
const path = require('path');

const gatsbyBin = path.join(__dirname, '..', 'node_modules', '.bin', 'gatsby.cmd');
const args = ['/c', gatsbyBin, ...process.argv.slice(2)];

const child = spawn('cmd.exe', args, {
  stdio: 'inherit',
  shell: false,
  env: {
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
  },
});

child.on('exit', code => {
  process.exit(code ?? 0);
});
