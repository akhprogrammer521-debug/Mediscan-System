import * as service from "./settings.service"
import { Request, Response } from "express"

export const getAdminSettings = async (_req: Request, res: Response) => {
  const data = await service.getSettingsForRole("ADMIN")
  res.json({ success: true, data })
}

export const updateAdminSettings = async (req: Request, res: Response) => {
  const data = await service.updateSettingsForRole("ADMIN", req.body.settings)
  res.json({ success: true, data })
}
