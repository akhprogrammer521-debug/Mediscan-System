import { Response } from "express";
import { AuthRequest } from "../../../common/middlewares/auth.middleware";
import { ok } from "../../../common/utils/apiResponse";
import { TtsService } from "./tts.service";
import { ttsSpeakSchema } from "./tts.validation";

export class TtsController {
  static async speak(req: AuthRequest, res: Response) {
    const { text, lang } = ttsSpeakSchema.parse(req.body);
    const result = await TtsService.speak(text, lang);
    return ok(res, result);
  }
}
