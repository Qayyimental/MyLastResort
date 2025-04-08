import { platform } from 'os';
import { join } from 'path';

export const isWindows = platform() === 'win32';
export const isMac = platform() === 'darwin';
export const isLinux = platform() === 'linux';

export function getPlatformConfigPath(): string {
    if (isWindows) {
        return join(process.env.APPDATA || '', 'financial-analysis');
    } else if (isMac) {
        return join(process.env.HOME || '', 'Library', 'Application Support', 'financial-analysis');
    } else {
        return join(process.env.HOME || '', '.config', 'financial-analysis');
    }
}

export function getDocumentsPath(): string {
    if (isWindows) {
        return join(process.env.USERPROFILE || '', 'Documents');
    } else if (isMac) {
        return join(process.env.HOME || '', 'Documents');
    } else {
        return join(process.env.HOME || '', 'Documents');
    }
}
