const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');

function setEnvRoot() {
  const envPath = path.resolve(ROOT, '.env');
  const envLocalPath = path.resolve(ROOT, '.env.local');

  if (!fs.existsSync(envPath)) {
    return;
  }

  if (fs.existsSync(envLocalPath)) {
    return;
  }

  fs.cpSync(envPath, envLocalPath);
}

function setEnvApps() {
  const appsPath = path.resolve(ROOT, 'apps');
  const apps = fs.readdirSync(appsPath);

  for (const app of apps) {
    const envPath = path.resolve(ROOT, 'apps', app, '.env');
    const envLocalPath = path.resolve(ROOT, 'apps', app, '.env.local');

    if (!fs.existsSync(envPath)) {
      continue;
    }

    if (fs.existsSync(envLocalPath)) {
      continue;
    }

    fs.cpSync(envPath, envLocalPath);
  }
}

function husky() {
  spawnSync('pnpx', ['husky']);
}

setEnvRoot();
husky();
