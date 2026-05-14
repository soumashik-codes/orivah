export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const TOKEN_STORAGE_KEY = "orivah_token";

export type LoginResponse = {
  access_token: string;
  token_type: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  created_at: string;
};

export type Client = {
  id: number;
  user_id: number;
  name: string;
  email: string;
  company_name: string | null;
  phone: string | null;
  notes: string | null;
  created_at: string;
};

export type CreateClientPayload = {
  name: string;
  email: string;
  company_name?: string;
  phone?: string;
  notes?: string;
};

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | string;

export type Invoice = {
  id: number;
  user_id: number;
  client_id: number;
  invoice_number: string;
  amount: number | string;
  issue_date: string;
  due_date: string;
  paid_date: string | null;
  status: InvoiceStatus;
  description: string | null;
  created_at: string;
};

export type CreateInvoicePayload = {
  client_id: number;
  invoice_number: string;
  amount: number;
  issue_date: string;
  due_date: string;
  paid_date?: string | null;
  status: string;
  description?: string;
};

export type DashboardSummary = {
  outstanding_total?: number | string;
  overdue_total?: number | string;
  expected_next_30_days?: number | string;
  paid_this_month?: number | string;
  overdue_count?: number;
  risk_level?: string;
};

function getToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setToken(token: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }
}

export function clearToken() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");

  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    let message = "Request failed.";

    try {
      const errorData = (await response.json()) as { detail?: string };
      if (errorData.detail) {
        message = errorData.detail;
      }
    } catch {
      message = response.statusText || message;
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function registerUser(name: string, email: string, password: string) {
  return request<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function loginUser(email: string, password: string) {
  const response = await request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  setToken(response.access_token);
  return response;
}

export async function getClients() {
  return request<Client[]>("/clients");
}

export async function createClient(payload: CreateClientPayload) {
  return request<Client>("/clients", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getInvoices() {
  return request<Invoice[]>("/invoices");
}

export async function createInvoice(payload: CreateInvoicePayload) {
  return request<Invoice>("/invoices", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getDashboardSummary() {
  return request<DashboardSummary>("/dashboard/summary");
}
