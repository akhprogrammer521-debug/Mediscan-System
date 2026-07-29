import { Response, NextFunction } from 'express';
import { Request } from 'express';
import { Role } from '@prisma/client';

export const adminOnlyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== Role.ADMIN) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
