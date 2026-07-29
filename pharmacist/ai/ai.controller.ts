import { Response } from "express"
import { AuthRequest } from "../../../common/middlewares/auth.middleware"
import * as service from "./ai.service"
import { chatSchema } from "./ai.validation"
import { Role } from "@prisma/client"

export const chat = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    })
  }

  const { message } = chatSchema.parse(req.body)

  const reply = await service.chat({
    message,
    user: {
      id: req.user.userId, 
      role: req.user.role as Role,
    },
  })

  res.json({ success: true, data: reply })
}
