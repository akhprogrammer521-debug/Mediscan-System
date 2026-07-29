const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const FILE_PATH = path.resolve(__dirname, "drugs.csv");

function smartSplit(line) {
  if (line.includes("\t")) return line.split("\t");
  if (line.includes(";")) return line.split(";");
  return line.split(",");
}

async function importDrugs() {
  console.log("🧹 Cleaning existing data...");
  await prisma.drug.deleteMany();
  console.log("✅ Table cleaned");

  const content = fs.readFileSync(FILE_PATH, "utf8");
  const lines = content.split(/\r?\n/);
  lines.shift(); // remove header

  let inserted = 0;

  for (const line of lines) {
    if (!line.trim()) continue;

    const cols = smartSplit(line);
    if (cols.length < 6) continue;

    try {
      await prisma.drug.create({
        data: {
          name: cols[0]?.trim(),
          strength: "",
          description: cols[5]?.trim() || "",
          composition: cols[1]?.trim() || "",
          indications: cols[2]?.trim() || "",
          contraindications: "",
          dosage: "",
          warnings: "",
          sideEffects: cols[3]?.trim() || "",
          interactions: "",
          overdose: "",
        },
      });
      inserted++;
    } catch {}
  }

  console.log(`🎉 Imported ${inserted} drugs`);
  console.log("📊 Total:", await prisma.drug.count());
  await prisma.$disconnect();
}

importDrugs();
