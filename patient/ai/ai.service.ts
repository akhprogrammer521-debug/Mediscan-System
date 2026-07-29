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
    let medicalContext = null

    // إذا كان المستخدم مريضًا
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

      medicalContext = {
        gender: patient?.medicalInfo?.gender,
        birthDate: patient?.medicalInfo?.birthDate,
        height: patient?.medicalInfo?.height,
        weight: patient?.medicalInfo?.weight,
        allergies: patient?.medicalInfo?.allergies,
        chronicDiseases: patient?.medicalInfo?.chronicDiseases,
        medications: patient?.medications ?? [],
      }
    }

    // 🧠 إرسال السؤال + السياق الطبي للـ AI
    const response = await fetch(`${AI_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
question: message,        context: medicalContext,
      }),
    })

    if (!response.ok) {
      throw new Error(await response.text())
    }

    const data = (await response.json()) as AIServiceResponse

    return {
  answer: data.answer,
  confidence: data.confidence ?? null,
}

  } catch (error: any) {
    console.error("AI PATIENT CONTEXT ERROR:", error.message)

    return {
      question: message,
      answer:
        "تعذر الحصول على رد طبي موثوق حاليًا. يرجى المحاولة لاحقًا.",
      meta: {
        model: "lstm",
        confidence: null,
      },
    }
  }
}
