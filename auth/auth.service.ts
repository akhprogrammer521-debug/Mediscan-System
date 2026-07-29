import bcrypt from "bcryptjs";
import prisma from "../../config/database";
import { generateToken, generateRefreshToken, verifyToken } from "../../common/utils/jwt";
import { Role } from "@prisma/client";

export const loginAdmin = async (username: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      email: true,
      password: true,
      role: true,
      isActive: true,
    },
  });

  if (!user || !user.isActive) {
    throw new Error("Invalid credentials");
  }

  if (user.role !== Role.ADMIN) {
    throw new Error("Access denied: Admin role required");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error("Invalid credentials");
  }

  const payload = {
    userId: user.id,
    username: user.username,
    role: user.role,
  };

  const token = generateToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    token,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
};

export const refreshAccessToken = async (refreshToken: string) => {
  const decoded = verifyToken(refreshToken);

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      username: true,
      role: true,
      isActive: true,
    },
  });

  if (!user || !user.isActive) {
    throw new Error("Invalid refresh token");
  }

  const newToken = generateToken({
    userId: user.id,
    username: user.username,
    role: user.role,
  });

  return { token: newToken };
};
