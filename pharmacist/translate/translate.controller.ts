import { Request, Response } from "express"
import * as service from "./translate.service"

export const translate = async (req: Request, res: Response) => {
  const { text, from, to } = req.body

  if (!text || !from || !to) {
    return res.status(400).json({
      success: false,
      error: "Missing translation parameters",
    })
  }

  try {
    const translation = await service.translateText(text, from, to)
    res.json({ success: true, data: { translation } })
  } catch (e: any) {
    res.status(500).json({
      success: false,
      error: "Translation service unavailable",
    })
  }
}
