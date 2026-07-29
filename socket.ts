import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import { verifyToken } from "../../mediScan-backend/src/common/utils/jwt";

export type SocketUser = {
  userId: number;
  role: string;
};

let io: Server | null = null;

export function initSocket(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  // Auth middleware for sockets
  io.use((socket, next) => {
    try {
      const token =
        (socket.handshake.auth?.token as string | undefined) ||
        (socket.handshake.headers.authorization as string | undefined)?.split(" ")[1];

      if (!token) return next(new Error("Unauthorized"));

      const decoded = verifyToken(token) as any; 
      socket.data.user = { userId: decoded.userId, role: decoded.role } as SocketUser;

      // join user room
      socket.join(`user:${decoded.userId}`);

      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("disconnect", () => {
       console.log("socket disconnected");
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}

export function emitToUser(userId: number, event: string, payload: unknown) {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, payload);
}
