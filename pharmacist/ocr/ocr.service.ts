import prisma from "../../../config/database";
import { aiFlaskService } from "../../../common/services/aiFlask.service";

export class OcrService {

  static async scanDrug(imagePath: string, imageUrl: string) {
    const aiResult = await aiFlaskService.scanDrug(imagePath);
    const text: string = aiResult.text ?? "";
    const analysis = aiResult.analysis ?? {};
    const scan = await prisma.oCRScan.create({
      data: {
        imageUrl,
        text,
        language: analysis.language ?? "auto",
      },
    });

    const candidates = this.buildSearchCandidates(
      analysis.drugName,
      text
    );

    const drug = await this.matchDrugFromDatabase(candidates);

    const ttsText = drug
      ? this.buildTtsText(drug)
      : null;

    return {
      scan,
      drug,            
      analysis,        
      text,            
      ttsText,         
    };
  }

  static async scanPrescription(imagePath: string, imageUrl: string) {
    const aiResult = await aiFlaskService.scanPrescription(imagePath);
    const { text, translated } = aiResult;

    const prescription = await prisma.prescription.create({
      data: {
        imageUrl,
        content: text,
        translatedContent: translated ?? null,
      },
    });

    return {
      prescription,
      text,
      translated,
    };
  }

  private static buildSearchCandidates(
    drugName?: string,
    ocrText?: string
  ): string[] {
    const candidates = new Set<string>();

    if (drugName) {
      candidates.add(drugName.toLowerCase());
    }

    if (ocrText) {
      ocrText
        .split(/\n|,|\(|\)/)
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t.length > 3 && t.length < 40)
        .forEach((t) => candidates.add(t));
    }

    return Array.from(candidates);
  }


  private static async matchDrugFromDatabase(
    candidates: string[]
  ) {
    for (const term of candidates) {
      const drug = await prisma.drug.findFirst({
        where: {
          OR: [
            { name: { contains: term, mode: "insensitive" } },
            { composition: { contains: term, mode: "insensitive" } },
          ],
        },
      });

      if (drug) return drug;
    }

    return null;
  }



  private static buildTtsText(drug: any): string {
    return `
اسم الدواء: ${drug.name}.
المادة الفعالة: ${drug.composition}.
الاستطبابات: ${drug.indications}.
الجرعة: ${drug.dosage}.
تحذيرات الاستعمال: ${drug.warnings}.
التأثيرات الجانبية: ${drug.sideEffects}.
التداخلات الدوائية: ${drug.interactions}.
فرط الجرعة: ${drug.overdose}.
    `.trim();
  }
}
