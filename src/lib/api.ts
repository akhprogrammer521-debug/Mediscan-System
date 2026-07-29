// src/lib/api.ts
import Cookies from "js-cookie";

/* =========================
   CONFIG
========================= */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/* =========================
   SHARED TYPES
========================= */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type Role = "ADMIN" | "PATIENT" | "PHARMACIST";

export type OrderStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "COMPLETED"
  | "CANCELLED";

export type NotificationType = "SYSTEM" | "ORDER" | "MESSAGE";

/* =========================
   AUTH TYPES
========================= */
export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: Role;
    isActive?: boolean;
  };
}

/* =========================
   PRISMA-LIKE ENTITY TYPES
   (Aligned with your schema.prisma)
========================= */
export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminProfile extends Pick<
  User,
  "id" | "username" | "email" | "role" | "isActive" | "createdAt"
> {}

export interface MedicalInfo {
  id: number;
  patientId: number;
  gender: "MALE" | "FEMALE";
  birthDate: string;
  height: number;
  weight: number;
  currentMedications?: string | null;
  chronicMedications?: string | null;
  chronicDiseases?: string | null;
  allergies?: string | null;
}

export interface Patient {
  id: number
  userId: number

  user: {
    id: number
    username: string
    email: string
    isActive: boolean
    createdAt?: string
  }

  medicalInfo?: {
    gender?: 'MALE' | 'FEMALE'
    birthDate?: string
    height?: number
    weight?: number
    currentMedications?: string | null
    chronicMedications?: string | null
    chronicDiseases?: string | null
    allergies?: string | null
  } | null

  orders?: {
    id: number
    status: string
    createdAt: string
    pharmacy?: {
      name: string
    }
  }[]

  createdAt: string
}


export interface Pharmacist {
  id: number;
  userId: number;
  user: User;
  pharmacy?: Pharmacy | null;
}

export interface Pharmacy {
  id: number;
  name: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  phone: string;

  licenseNumber: string;
  licenseIssuedAt: string;
  licenseExpiresAt: string;

  pharmacistId: number;
  pharmacist: {
    id: number;
    userId: number;
    user: User;
  };

  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Drug {
  id: number;
  name: string;
  strength: string;
  description?: string | null;

  composition: string;
  indications: string;
  contraindications: string;
  dosage: string;
  warnings: string;
  sideEffects: string;
  interactions: string;
  overdose: string;
}

export interface Notification {
  id: number;
  userId?: number | null;
  toRole?: Role | null;

  type: NotificationType;
  title: string;
  message: string;

  isRead: boolean;
  createdAt: string;

  user?: User | null;
}

export interface SystemSetting {
  id: number;
  key: string;
  value: string;
  role: Role;
  label_ar?: string | null;
  createdAt: string;
  updatedAt?: string;
}


/* =========================
   DASHBOARD TYPES
========================= */
export interface DashboardCounts {
  patients: number;
  activePatients?: number;   // present after backend patch
  inactivePatients?: number; // present after backend patch

  pharmacists: number;

  pharmacies: number;
  activePharmacies: number;
  inactivePharmacies?: number; // present after backend patch

  drugs: number;

  orders: {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
    completed: number;
    cancelled: number;
  };
}

export interface DashboardStatsResponse {
  counts: DashboardCounts;
}

/* =========================
   INPUT TYPES (ADMIN)
========================= */
export interface CreatePharmacyInput {
  // user credentials (created by admin)
  username: string;
  password: string;
  email: string;

  // pharmacy data
  name: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  phone: string;

  licenseNumber: string;
  licenseIssuedAt: string;  // ISO string
  licenseExpiresAt: string; // ISO string
}

export interface UpdatePharmacyInput {
  name?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string;

  licenseNumber?: string;
  licenseIssuedAt?: string;
  licenseExpiresAt?: string;
}

export interface ToggleStatusInput {
  isActive: boolean;
}

export interface CreateDrugInput {
  name: string;
  strength: string;
  description?: string;

  composition: string;
  indications: string;
  contraindications: string;
  dosage: string;
  warnings: string;
  sideEffects: string;
  interactions: string;
  overdose: string;
}

export type UpdateDrugInput = Partial<CreateDrugInput>;

export interface UpdateSettingsInput {
  settings: { key: string; value: string }[];
}

/* =========================
   API CLIENT
========================= */
class ApiClient {
  constructor(private baseUrl: string) {}

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = Cookies.get("token");

    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    // Only set JSON headers when we send JSON bodies
    const hasBody = typeof options.body !== "undefined";
    if (!headers["Content-Type"] && hasBody) {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      // 204 No Content
      if (res.status === 204) {
        return { success: true };
      }

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data?.error || "Request failed" };
      }

      // Backend already returns { success, data }
      return data as ApiResponse<T>;
    } catch (e: any) {
      return { success: false, error: e?.message || "Network error" };
    }
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "GET" });
  }

  post<T>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body ?? {}),
      headers: { "Content-Type": "application/json" },
    });
  }

  put<T>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body ?? {}),
      headers: { "Content-Type": "application/json" },
    });
  }

  patch<T>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body ?? {}),
      headers: { "Content-Type": "application/json" },
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

/* =========================
   CLIENT INSTANCES
========================= */
const baseApi = new ApiClient(API_BASE_URL);
const adminApi = new ApiClient(`${API_BASE_URL}/api/admin`);

/* =========================
   AUTH (ADMIN)
   Backend route: POST /auth/admin/login
========================= */
export const authApi = {
  login: (username: string, password: string) =>
    baseApi.post<LoginResponse>("/api/auth/admin/login", { username, password }),
};

/* =========================
   ADMIN PROFILE
   Backend route: GET /profile
========================= */
export const adminProfileApi = {
  getProfile: () => baseApi.get<AdminProfile>("/profile"),
};

/* =========================
   DASHBOARD
   Backend route: GET /admin/dashboard
========================= */
export const dashboardApi = {
  getStats: () => adminApi.get<DashboardStatsResponse>("/dashboard"),
};

/* =========================
   PHARMACIES
   Backend routes:
     POST   /admin/pharmacies
     GET    /admin/pharmacies
     GET    /admin/pharmacies/:id
     PUT    /admin/pharmacies/:id
     DELETE /admin/pharmacies/:id
     PATCH  /admin/pharmacies/:id/status
========================= */
export const pharmaciesApi = {
  getAll: () => adminApi.get<Pharmacy[]>("/pharmacies"),
  getById: (id: number) => adminApi.get<Pharmacy>(`/pharmacies/${id}`),

  create: (payload: CreatePharmacyInput) =>
    adminApi.post<Pharmacy>("/pharmacies", payload),

  update: (id: number, payload: UpdatePharmacyInput) =>
    adminApi.put<Pharmacy>(`/pharmacies/${id}`, payload),

  delete: (id: number) => adminApi.delete<void>(`/pharmacies/${id}`),

  toggleStatus: (id: number, isActive: boolean) =>
    adminApi.patch<{ success: true }>(`/pharmacies/${id}/status`, { isActive }),

  resetPassword: (id: number) =>
  adminApi.patch<{
    username: string
    password: string
  }>(`/pharmacies/${id}/reset-password`)


};

/* =========================
   DRUGS
   Backend routes:
     POST   /admin/drugs
     GET    /admin/drugs
     GET    /admin/drugs/:id
     PUT    /admin/drugs/:id
     DELETE /admin/drugs/:id
========================= */
export const drugsApi = {
  getAll: () => adminApi.get<Drug[]>("/drugs"),
  getById: (id: number) => adminApi.get<Drug>(`/drugs/${id}`),

  create: (payload: CreateDrugInput) =>
    adminApi.post<Drug>("/drugs", payload),

  update: (id: number, payload: UpdateDrugInput) =>
    adminApi.put<Drug>(`/drugs/${id}`, payload),

  delete: (id: number) => adminApi.delete<void>(`/drugs/${id}`),
};

/* =========================
   USERS (PATIENTS & PHARMACISTS)
   Backend routes:
     GET   /admin/users/patients?search=
     GET   /admin/users/patients/:id
     PATCH /admin/users/patients/:id/status

     GET   /admin/users/pharmacists
     GET   /admin/users/pharmacists/:id
     PATCH /admin/users/pharmacists/:id/status
========================= */
export const usersApi = {
  getPatients: (search?: string) =>
    adminApi.get<Patient[]>(
      `/users/patients${search ? `?search=${encodeURIComponent(search)}` : ""}`
    ),

  getPatientById: (id: number) =>
    adminApi.get<Patient>(`/users/patients/${id}`),

  togglePatientStatus: (id: number) =>
    adminApi.patch<User>(`/users/patients/${id}/status`),

  getPharmacists: () => adminApi.get<Pharmacist[]>("/users/pharmacists"),

  getPharmacistById: (id: number) =>
    adminApi.get<Pharmacist>(`/users/pharmacists/${id}`),

  togglePharmacistStatus: (id: number) =>
    adminApi.patch<User>(`/users/pharmacists/${id}/status`),
};

/* =========================
   NOTIFICATIONS (ADMIN)
   Backend routes:
     GET   /admin/notifications
     PATCH /admin/notifications/:id/read
========================= */
export const notificationsApi = {
  getAll: () => adminApi.get<Notification[]>("/notifications"),

  markAsRead: (id: number) =>
    adminApi.patch<Notification>(`/notifications/${id}/read`),
};

/* =========================
   SETTINGS (ADMIN)
   Backend routes:
     GET /admin/settings
     PUT /admin/settings   body: { settings: [{key,value}] }
========================= */
export const settingsApi = {
  get: () => adminApi.get<SystemSetting[]>("/settings"),

  update: (payload: UpdateSettingsInput) =>
    adminApi.put<SystemSetting[]>("/settings", payload),
};
