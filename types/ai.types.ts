import { Role } from "@prisma/client"

export type AIUserContext = {
  id: number
  role: Role

  patientContext?: {
    age?: number
    gender?: "MALE" | "FEMALE"
    chronicDiseases?: string | null
    allergies?: string | null
    currentMedications?: string | null
  }
}

export type AIChatContext = {
  message: string
  user: AIUserContext
}
