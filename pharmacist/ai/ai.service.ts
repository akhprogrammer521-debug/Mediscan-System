import prisma from "../../../config/database"
import fetch from "node-fetch"
import { AIChatContext } from "../../../types/ai.types"

type AIServiceResponse = {
  answer: string
  confidence?: number
}

const AI_BASE_URL = process.env.AI_BASE_URL || "http://localhost:8000"

export const chat = async ({ message, user }: AIChatContext) => {
  try {
    let context: any = null

    if (user.role === "PATIENT") {
      const patient = await prisma.patient.findUnique({
        where: { userId: user.id },
        include: {
          medicalInfo: true,
          medications: {
            where: { status: "ACTIVE" },
            select: {
              name: true,
              dosage: true,
            },
          },
        },
      })

      context = {
        role: "PATIENT",
        medicalInfo: patient?.medicalInfo,
        medications: patient?.medications ?? [],
      }
    }

    if (user.role === "PHARMACIST") {
  
      const possibleDrugs = await prisma.drug.findMany({
        where: {
          name: {
            contains: message.split(" ")[0], 
          },
        },
        select: {
          name: true,
          strength: true,
        },
        take: 2,
      })

      context = {
        role: "PHARMACIST",
        drugs: possibleDrugs,
      }
    }

    const response = await fetch(`${AI_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: message,
      }),
    })

    if (!response.ok) {
      throw new Error(await response.text())
    }

    const data = (await response.json()) as AIServiceResponse

    if (!data.answer) {
  throw new Error("AI returned empty answer")
}


    return {
      question: message,
      answer: data.answer,
      meta: {
        model: "rag-st",
        confidence: data.confidence ?? null,
      },
    }
  } catch (error: any) {
    console.error("AI SERVICE ERROR:", error.message)

    return {
      question: message,
      answer:
        "تعذر الحصول على معلومات طبية موثوقة حاليًا. يرجى المحاولة لاحقًا.",
      meta: {
        model: "lstm",
        confidence: null,
      },
    }
  }
}
