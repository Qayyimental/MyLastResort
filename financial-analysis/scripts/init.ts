import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const requiredDirs = [
    'logs',
    'public',
    'dist',
    'dist/exe',
    'dist/packaged',
    'launchers'
];

console.log('Creating required directories...');

requiredDirs.forEach(dir => {
    const path = join(process.cwd(), dir);
    if (!existsSync(path)) {
        mkdirSync(path, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
});

console.log('Directory initialization complete.');
