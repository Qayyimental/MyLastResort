import winston from 'winston';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const logsDir = join(process.cwd(), 'logs');

// Ensure logs directory exists
if (!existsSync(logsDir)) {
    mkdirSync(logsDir, { recursive: true });
}

export function createLogger(module: string) {
    return winston.createLogger({
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        ),
        defaultMeta: { service: module },
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({
                filename: join('logs', 'error.log'),
                level: 'error'
            }),
            new winston.transports.File({
                filename: join('logs', 'combined.log')
            })
        ]
    });
}
