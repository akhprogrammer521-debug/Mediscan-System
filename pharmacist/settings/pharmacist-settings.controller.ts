import { Request, Response } from "express"
import * as service from "./pharmacist-settings.service"

export const getSettings = async (req: Request, res: Response) => {
  const userId = req.user!.userId
  const pharmacyId = req.user!.pharmacyId ?? undefined

  const settings = await service.getSettings(userId, pharmacyId)

  res.json({ success: true, data: settings })
}

export const updateSettings = async (req: Request, res: Response) => {
  const userId = req.user!.userId
  const pharmacyId = req.user!.pharmacyId ?? undefined

  await service.updateSettings(userId, pharmacyId, req.body.settings)

  res.json({ success: true })
}
