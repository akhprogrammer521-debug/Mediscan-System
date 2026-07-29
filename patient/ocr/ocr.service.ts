import prisma from "../../../config/database";
import { aiFlaskService } from "../../../common/services/aiFlask.service";
import type { Drug } from "@prisma/client";

export class OcrService {
  /* =========================
     SCAN DRUG
  ========================= */
  static async scanDrug(imagePath: string, imageUrl: string) {
    const aiResult = await aiFlaskService.scanDrug(imagePath);

    const text: string = aiResult?.medication_info ?? "";

    const analysis = {
      drugName: aiResult?.predicted_medicine ?? null,
      confidence: aiResult?.confidence ?? null,
      source: aiResult?.source ?? null,
    };

    const scan = await prisma.oCRScan.create({
      data: {
        imageUrl,
        text,
        language: "auto",
      },
    });

    const candidates = this.buildSearchCandidates(
      analysis.drugName,
      text
    );

    const drug = await this.matchDrugFromDatabase(candidates);

    const ttsText = drug ? this.buildTtsText(drug) : null;

    return {
      scan,
      drug,
      analysis,
      text,
      ttsText,
    };
  }

  /* =========================
     SCAN PRESCRIPTION
  ========================= */
  static async scanPrescription(imagePath: string, imageUrl: string) {
    const aiResult = await aiFlaskService.scanPrescription(imagePath);

    const text: string = aiResult?.text ?? "";
    const translated: string | null = aiResult?.translated ?? null;

    const prescription = await prisma.prescription.create({
      data: {
        imageUrl,
        content: text,
        translatedContent: translated,
      },
    });

    const matchSource =
      translated && translated.trim().length > 0 ? translated : text;

    const candidates = this.buildPrescriptionCandidates(matchSource);

    const drugs = await this.matchMultipleDrugsFromDatabase(candidates, 12);

    const ttsText = drugs.length
      ? drugs.map((d) => this.buildShortTtsText(d)).join("\n\n")
      : null;

    return {
      prescription,
      text,
      translated,
      drugs,
      ttsText,
    };
  }

  /* =========================
     CANDIDATE BUILDERS
  ========================= */
  private static buildSearchCandidates(
    drugName?: string | null,
    ocrText?: string
  ): string[] {
    const candidates = new Set<string>();

    const push = (v?: string | null) => {
      const x = (v ?? "").toLowerCase().trim();
      if (x.length >= 3 && x.length <= 60) candidates.add(x);
    };

    push(drugName);

    // Normalize Z-brand names (Z-Ketocare → Ketocare)
    if (drugName?.toLowerCase().startsWith("z-")) {
      push(drugName.replace(/^z[-\s]?/i, ""));
    }

    if (ocrText) {
      ocrText
        .split(/\n|,|\(|\)|\[|\]|\{|\}|\-|\+|\*|\//)
        .map((t) => t.trim())
        .filter((t) => t.length > 3 && t.length < 60)
        .forEach((t) => push(t));
    }

    return Array.from(candidates);
  }

  private static buildPrescriptionCandidates(text: string): string[] {
    const candidates = new Set<string>();

    const cleaned = (text ?? "")
      .replace(/\r/g, "\n")
      .replace(/\t/g, " ")
      .toLowerCase();

    const lines = cleaned
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, 60);

    const normalize = (s: string) =>
      s
        .replace(/\b\d+(\.\d+)?\b/g, " ")
        .replace(/\b(mg|ml|mcg|g|iu|%)\b/g, " ")
        .replace(
          /\b(tablet|tab|capsule|cap|syrup|injection|inj|drops|drop|cream|ointment)\b/g,
          " "
        )
        .replace(/[^a-z\u0600-\u06FF\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    for (const line of lines) {
      const n = normalize(line);
      if (!n) continue;

      const words = n.split(" ").filter(Boolean);

      for (let k = 1; k <= Math.min(4, words.length); k++) {
        const chunk = words.slice(0, k).join(" ");
        if (chunk.length >= 3 && chunk.length <= 40) {
          candidates.add(chunk);
        }
      }

      if (n.length >= 3 && n.length <= 40) {
        candidates.add(n);
      }
    }

    return Array.from(candidates);
  }


  private static normalizeTerm(term: string): string {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

  /* =========================
     DATABASE MATCHING
  ========================= */
  private static async matchDrugFromDatabase(
  candidates: string[]
): Promise<Drug | null> {
  for (const raw of candidates) {
    const term = this.normalizeTerm(raw);

    // ❗ تجاهل garbage OCR
    if (
      term.length < 3 ||
      term.includes("image load failed") ||
      term.includes("error")
    ) {
      continue;
    }

    const drug = await prisma.drug.findFirst({
      where: {
        OR: [
          {
            name: {
              contains: term,
            },
          },
          {
            composition: {
              contains: term,
            },
          },
        ],
      },
    });

    if (drug) return drug;
  }

  return null;
}

  private static async matchMultipleDrugsFromDatabase(
  candidates: string[],
  limit: number
): Promise<Drug[]> {
  const found = new Map<number, Drug>();

  for (const raw of candidates) {
    if (found.size >= limit) break;

    const term = this.normalizeTerm(raw);

    if (term.length < 3) continue;

    const hits = await prisma.drug.findMany({
      where: {
        OR: [
          { name: { contains: term } },
          { composition: { contains: term } },
        ],
      },
      take: 5,
    });

    for (const d of hits) {
      found.set(d.id, d);
      if (found.size >= limit) break;
    }
  }

  return Array.from(found.values());
}


  /* =========================
     TTS BUILDERS
  ========================= */
  private static buildTtsText(drug: Drug): string {
    return [
      `اسم الدواء: ${drug.name}.`,
      `المادة الفعالة: ${drug.composition}.`,
      `الاستطبابات: ${drug.indications}.`,
      `الجرعة: ${drug.dosage}.`,
      `تحذيرات الاستعمال: ${drug.warnings}.`,
      `التأثيرات الجانبية: ${drug.sideEffects}.`,
      `التداخلات الدوائية: ${drug.interactions}.`,
      `فرط الجرعة: ${drug.overdose}.`,
    ].join("\n");
  }

  private static buildShortTtsText(drug: Drug): string {
    return [
      `دواء: ${drug.name}.`,
      drug.composition ? `المادة الفعالة: ${drug.composition}.` : null,
      drug.indications ? `الاستطبابات: ${drug.indications}.` : null,
      drug.sideEffects ? `التأثيرات الجانبية: ${drug.sideEffects}.` : null,
    ]
      .filter(Boolean)
      .join("\n");
  }
}
