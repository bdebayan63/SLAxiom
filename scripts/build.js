import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Building SLAxiom frontend for production deployment...');
execSync('npm --prefix frontend run build', { stdio: 'inherit' });

const src = path.resolve('frontend/dist');
const dest = path.resolve('dist');

console.log(`Copying distribution bundle from ${src} to ${dest}...`);
if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest, { recursive: true });
}
fs.cpSync(src, dest, { recursive: true, force: true });

console.log('✓ Successfully created dist/ at repository root and frontend/dist/!');
