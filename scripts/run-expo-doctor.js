const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');

if (process.env.CI) {
  for (const nativeDir of ['android', 'ios']) {
    fs.rmSync(path.join(projectRoot, nativeDir), { recursive: true, force: true });
  }
}

const binName = process.platform === 'win32' ? 'expo-doctor.cmd' : 'expo-doctor';
const result = spawnSync(binName, { cwd: projectRoot, stdio: 'inherit', shell: true });

process.exit(result.status ?? 1);
