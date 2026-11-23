import winston from 'winston';
import path from 'path';
import { config } from '../config/env';

const baseFormats = [
    winston.format.errors({ stack: true }),
    winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
];

const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    ...baseFormats,
    winston.format.json()
);

const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    ...baseFormats,
    winston.format.colorize({ all: true }),
    winston.format.printf(({ timestamp, level, message, metadata }) => {
        const metaObj =
            typeof metadata === 'object' && metadata !== null
                ? (metadata as Record<string, unknown>)
                : {};
        const meta = Object.keys(metaObj).length ? ` ${JSON.stringify(metaObj)}` : '';
        return `${timestamp} [${level}]: ${message}${meta}`;
    })
);

export const logger = winston.createLogger({
    level: config.isProd ? 'info' : 'debug',
    format: logFormat,
    defaultMeta: { service: 'api' },
    transports: [
        new winston.transports.File({
            filename: path.join('logs', 'combined.log'),
            maxsize: 5242880, // 5 MB
            maxFiles: 5,
        }),
        new winston.transports.File({
            filename: path.join('logs', 'error.log'),
            level: 'error',
            maxsize: 5242880, // 5 MB
            maxFiles: 5,
        }),
    ],
    exitOnError: false,
});

if (config.isDev) {
    logger.add(
        new winston.transports.Console({
            format: consoleFormat,
        })
    );
}

export const createLogger = (context: string) => {
    return logger.child({ context });
};