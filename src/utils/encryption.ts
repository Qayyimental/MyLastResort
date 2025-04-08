import crypto from 'crypto';

const KEY_VERSION = 1;
const ENCRYPTION_KEYS = new Map<number, Buffer>([
    [1, Buffer.from(process.env.ENCRYPTION_KEY_V1 || crypto.randomBytes(32))]
]);

export function encrypt(text: string, version = KEY_VERSION): string {
    const key = ENCRYPTION_KEYS.get(version);
    if (!key) throw new Error('Invalid key version');

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();

    const result = Buffer.concat([
        Buffer.from([version]),
        iv,
        tag,
        encrypted
    ]);
    return result.toString('base64');
}

export function decrypt(encryptedText: string): string {
    const data = Buffer.from(encryptedText, 'base64');
    const version = data[0];
    const key = ENCRYPTION_KEYS.get(version);
    if (!key) throw new Error('Invalid key version');

    const iv = data.subarray(1, 17);
    const tag = data.subarray(17, 33);
    const encrypted = data.subarray(33);

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    return decipher.update(encrypted) + decipher.final('utf8');
}
