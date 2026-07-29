import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const AI_OCR_URL = process.env.AI_FLASK_URL || "http://localhost:5001";

class AIFlaskService {
  /**
   * OCR + تحليل دواء
   */
  async scanDrug(imagePath: string) {
    try {
      const form = new FormData();
      form.append("image", fs.createReadStream(imagePath));

      const res = await axios.post(
        `${AI_OCR_URL}/ocr/drug`,
        form,
        {
          headers: form.getHeaders(),
          timeout: 60_000,
        }
      );

      return res.data;
    } catch (err: any) {
      console.error("AI Flask OCR (drug) error:", err.message);
      throw new Error("AI OCR service is not reachable");
    }
  }

  /**
   * OCR وصفة طبية
   */
  async scanPrescription(imagePath: string) {
    try {
      const form = new FormData();
      form.append("image", fs.createReadStream(imagePath));

      const res = await axios.post(
        `${AI_OCR_URL}/ocr/prescription`,
        form,
        {
          headers: form.getHeaders(),
          timeout: 60_000,
        }
      );

      return res.data;
    } catch (err: any) {
      console.error("AI Flask OCR (prescription) error:", err.message);
      throw new Error("AI Prescription OCR service is not reachable");
    }
  }

  /**
   * Text To Speech (TTS)
   */
  async textToSpeech(text: string, language = "ar") {
    try {
      const res = await axios.post(
        `${AI_OCR_URL}/tts`,
        {
          text,
          language,
        },
        {
          timeout: 60_000,
        }
      );

      return res.data; 
      // مثال:
      // { audioUrl: "/tts/output_123.mp3" }
    } catch (err: any) {
      console.error("AI Flask TTS error:", err.message);
      throw new Error("AI TTS service is not reachable");
    }
  }
}

export const aiFlaskService = new AIFlaskService();
