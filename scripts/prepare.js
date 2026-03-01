const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');

function setEnvRoot() {
  const envPath = path.resolve(ROOT, '.env');
  const envLocalPath = path.resolve(ROOT, '.env.local');

  if (!fs.existsSync(envLocalPath)) {
    return;
  }

  if (fs.existsSync(envPath)) {
    return;
  }

  fs.cpSync(envLocalPath, envPath);
}

function setEnvApps() {
  const appsPath = path.resolve(ROOT, 'apps');
  const apps = fs.readdirSync(appsPath);

  for (const app of apps) {
    const envPath = path.resolve(ROOT, 'apps', app, '.env');
    const envLocalPath = path.resolve(ROOT, 'apps', app, '.env.local');

    if (!fs.existsSync(envLocalPath)) {
      continue;
    }

    if (fs.existsSync(envPath)) {
      continue;
    }

    fs.cpSync(envLocalPath, envPath);
  }
}

function husky() {
  spawnSync('pnpx', ['husky']);
}

setEnvRoot();
husky();
