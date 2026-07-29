import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import prisma from '../../config/database';
import { Role } from '@prisma/client';
import { ForbiddenError, UnauthorizedError } from '../errors';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    username: string;
    role: string;
    patientId?: number;
    pharmacistId?: number;
  };
}


export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('Unauthorized');
    }

    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, isActive: true, username: true, role: true },
    });

    if (!user || !user.isActive) {
      throw new ForbiddenError('User account is inactive');
    }

    req.user = {
      userId: user.id,
      username: user.username,
      role: user.role,
    };

    if (decoded.role === Role.PATIENT) {
      const patient = await prisma.patient.findUnique({
        where: { userId: decoded.userId },
        select: { id: true },
      });

      if (!patient) {
        throw new UnauthorizedError('Patient not found');
      }

      req.user.patientId = patient.id;
    }

    if (decoded.role === Role.PHARMACIST) {
      const pharmacist = await prisma.pharmacist.findUnique({
        where: { userId: decoded.userId },
        select: { id: true },
      });

      if (!pharmacist) {
        throw new UnauthorizedError('Pharmacist not found');
      }

      req.user.pharmacistId = pharmacist.id;
    }

    next();
  } catch (err: any) {
    if (err instanceof ForbiddenError || err instanceof UnauthorizedError) {
      return next(err);
    }
    return next(new UnauthorizedError('Invalid token'));
  }
};