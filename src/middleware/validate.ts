import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ValidationError } from '../utils/errors';

type ValidationSource = 'body' | 'params' | 'query';

function assignValidatedValue(
    req: Request,
    source: ValidationSource,
    value: unknown
): void {
    if (source === 'query' && typeof value === 'object' && value !== null) {
        const target = req.query as Record<string, unknown>;
        for (const key of Object.keys(target)) {
            delete target[key];
        }
        Object.assign(target, value);
        return;
    }

    (req as unknown as Record<ValidationSource, unknown>)[source] = value;
}

export const validate = (
    schema: Joi.ObjectSchema,
    source: ValidationSource = 'body'
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error, value } = schema.validate(req[source], {
            abortEarly: false,
            stripUnknown: true,
            convert: true,
        });

        if (error) {
            const details = error.details.map((detail) => ({
                field: detail.path.join('.'),
                message: detail.message,
                type: detail.type,
            }));

            const message = details.map((d) => d.message).join(', ');

            return next(new ValidationError(message, details));
        }

        assignValidatedValue(req, source, value);
        return next();
    };
};