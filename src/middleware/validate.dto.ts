import { type Request, type Response, type NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { RegisterDto } from '../dto/user/register.dto.js';

export const validateRegisterDto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dtoInstance = plainToClass(RegisterDto, req.body);

    const errors = await validate(dtoInstance, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const formattedErrors = errors.map((err) => ({
        field: err.property,
        message: Object.values(err.constraints || {})[0] || 'Invalid value',
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }

    // Attach validated DTO directly to req.validatedBody
    req.validatedBody = dtoInstance;

    next();
  } catch (err) {
    console.error('Validation middleware error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal validation error',
    });
  }
};