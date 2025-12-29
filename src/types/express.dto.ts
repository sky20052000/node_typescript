import { RegisterDto } from '../dto/user/register.dto.js';

declare global {
  namespace Express {
    interface Request {
      validatedBody?: RegisterDto;
    }
  }
}