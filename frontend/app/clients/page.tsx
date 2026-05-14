"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { Client, createClient, getClients } from "@/lib/api";

import { OrivahSidebar } from "../_components/orivah-sidebar";

type RiskLevel = "Low" | "Medium" | "High";

type ClientFormState = {
  name: string;
  email: string;
  company_name: string;
  phone: string;
  notes: string;
};

function getRiskBadgeClass(riskLevel: RiskLevel) {
  if (riskLevel === "High") {
    return "bg-rose-50 text-rose-600";
  }

  if (riskLevel === "Medium") {
    return "bg-amber-50 text-amber-600";
  }

  return "bg-emerald-50 text-emerald-600";
}

function getDerivedRiskLevel(client: Client): RiskLevel {
  if (client.notes?.toLowerCase().includes("overdue")) {
    return "High";
  }

  if (client.phone) {
    return "Medium";
  }

  return "Low";
}

const initialFormState: ClientFormState = {
  name: "",
  email: "",
  company_name: "",
  phone: "",
  notes: "",
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formState, setFormState] = useState<ClientFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function refreshClients() {
    setIsLoading(true);
    setError("");

    try {
      const data = await getClients();
      setClients(data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load clients.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadInitialClients() {
      try {
        const data = await getClients();
        if (!isMounted) {
          return;
        }
        setClients(data);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load clients.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialClients();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return clients;
    }

    return clients.filter((client) => {
      return (
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        (client.company_name ?? "").toLowerCase().includes(query)
      );
    });
  }, [clients, search]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      await createClient({
        name: formState.name,
        email: formState.email,
        company_name: formState.company_name || undefined,
        phone: formState.phone || undefined,
        notes: formState.notes || undefined,
      });
      setFormState(initialFormState);
      setIsFormOpen(false);
      await refreshClients();
    } catch (createError) {
      setSubmitError(
        createError instanceof Error
          ? createError.message
          : "Unable to create client.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.10),_transparent_30%),linear-gradient(to_bottom,_#f8fafc,_#eef2f7)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:flex-row lg:px-8">
        <OrivahSidebar activeItem="Clients" />

        <section className="flex-1">
          <div className="rounded-[32px] border border-slate-200 bg-white/90 p-5 shadow-sm shadow-slate-200/50 backdrop-blur sm:p-6 lg:p-8">
            <header className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-sky-600">
                  Client relationships
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                  Clients
                </h1>
              </div>
              <button
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                type="button"
                onClick={() => setIsFormOpen((open) => !open)}
              >
                Add Client
              </button>
            </header>

            {isFormOpen ? (
              <form
                className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 p-5"
                onSubmit={handleSubmit}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-300"
                    placeholder="Client name"
                    value={formState.name}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    required
                  />
                  <input
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-300"
                    type="email"
                    placeholder="Email"
                    value={formState.email}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    required
                  />
                  <input
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-300"
                    placeholder="Company name"
                    value={formState.company_name}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        company_name: event.target.value,
                      }))
                    }
                  />
                  <input
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-300"
                    placeholder="Phone"
                    value={formState.phone}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        phone: event.target.value,
                      }))
                    }
                  />
                </div>

                <textarea
                  className="mt-4 min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-300"
                  placeholder="Notes"
                  value={formState.notes}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      notes: event.target.value,
                    }))
                  }
                />

                {submitError ? (
                  <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                    {submitError}
                  </div>
                ) : null}

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button
                    className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving client..." : "Save client"}
                  </button>
                  <button
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : null}

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 sm:max-w-md">
                <span className="text-sm text-slate-400">Search</span>
                <input
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  type="text"
                  placeholder="Search clients by name or email"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
              <div className="rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-sm text-sky-700">
                {filteredClients.length} active clients
              </div>
            </div>

            {isLoading ? (
              <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 px-5 py-8 text-sm text-slate-500">
                Loading clients...
              </div>
            ) : error ? (
              <div className="mt-8 rounded-[28px] border border-rose-200 bg-rose-50 px-5 py-8 text-sm text-rose-600">
                {error}
              </div>
            ) : (
              <div className="mt-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr className="border-b border-slate-100">
                        <th className="px-5 py-4 font-medium">Client name</th>
                        <th className="px-5 py-4 font-medium">Email</th>
                        <th className="px-5 py-4 font-medium">Total outstanding</th>
                        <th className="px-5 py-4 font-medium">Overdue amount</th>
                        <th className="px-5 py-4 font-medium">Risk level</th>
                        <th className="px-5 py-4 font-medium">Last payment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClients.map((client) => {
                        const riskLevel = getDerivedRiskLevel(client);

                        return (
                          <tr
                            key={client.id}
                            className="border-b border-slate-100 last:border-none"
                          >
                            <td className="px-5 py-4 font-medium text-slate-950">
                              {client.name}
                            </td>
                            <td className="px-5 py-4 text-slate-600">
                              {client.email}
                            </td>
                            <td className="px-5 py-4 text-slate-950">
                              {"\u00A30"}
                            </td>
                            <td className="px-5 py-4 text-slate-950">
                              {"\u00A30"}
                            </td>
                            <td className="px-5 py-4">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${getRiskBadgeClass(
                                  riskLevel,
                                )}`}
                              >
                                {riskLevel}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-slate-600">-</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
