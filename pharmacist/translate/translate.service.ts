import fetch from "node-fetch"

const TRANSLATE_URL =
  process.env.AI_Traslate_URL || "http://localhost:8002"

type TranslateResponse = {
  translation: string
}

export const translateText = async (
  text: string,
  from: "en",
  to: "ar" 
) => {
  const res = await fetch(`${TRANSLATE_URL}/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, from, to }),
  })

  if (!res.ok) {
    throw new Error(await res.text())
  }

  const data = (await res.json()) as TranslateResponse

  return data.translation
}
