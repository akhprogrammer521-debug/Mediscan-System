import fs from "fs";
import path from "path";
import crypto from "crypto";
import { aiFlaskService } from "../../../common/services/aiFlask.service";

export class TtsService {
  static async speak(text: string, lang: string = "ar") {
    const { audioBuffer, contentType } = await aiFlaskService.textToSpeech(text, lang);

    const uploadsDir = path.resolve(process.cwd(), "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const ext = contentType.includes("wav") ? "wav" : "mp3";
    const filename = `tts-${crypto.randomUUID()}.${ext}`;
    const filePath = path.join(uploadsDir, filename);

    await fs.promises.writeFile(filePath, audioBuffer);

    return {
      audioUrl: `/uploads/${filename}`,
      contentType,
    };
  }
}
