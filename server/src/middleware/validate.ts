import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

export const validateBody =
  (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err: any) {
      return res.status(400).json({ message: 'Validation error', errors: err.errors });
    }
  };


