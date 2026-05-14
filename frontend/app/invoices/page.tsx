"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import {
  Client,
  Invoice,
  createInvoice,
  getClients,
  getInvoices,
} from "@/lib/api";

import { OrivahSidebar } from "../_components/orivah-sidebar";

type FilterOption = "All" | "Draft" | "Sent" | "Paid" | "Overdue" | "Due Soon";

type InvoiceFormState = {
  client_id: string;
  invoice_number: string;
  amount: string;
  issue_date: string;
  due_date: string;
  paid_date: string;
  status: "draft" | "sent" | "paid" | "overdue";
  description: string;
};

const filters: FilterOption[] = [
  "All",
  "Draft",
  "Sent",
  "Paid",
  "Overdue",
  "Due Soon",
];

const initialFormState: InvoiceFormState = {
  client_id: "",
  invoice_number: "",
  amount: "",
  issue_date: "",
  due_date: "",
  paid_date: "",
  status: "draft",
  description: "",
};

function toTitleCase(status: string) {
  return status
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function isDueSoon(invoice: Invoice) {
  if (invoice.status.toLowerCase() !== "sent") {
    return false;
  }

  const dueDate = new Date(invoice.due_date);
  const today = new Date();
  const diffInMs = dueDate.getTime() - today.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  return diffInDays >= 0 && diffInDays <= 7;
}

function getDisplayStatus(invoice: Invoice) {
  if (isDueSoon(invoice)) {
    return "Due Soon";
  }

  return toTitleCase(invoice.status);
}

function getStatusBadgeClass(status: string) {
  if (status.toLowerCase() === "paid") {
    return "bg-emerald-50 text-emerald-600";
  }

  if (status.toLowerCase() === "overdue") {
    return "bg-rose-50 text-rose-600";
  }

  if (status.toLowerCase() === "draft") {
    return "bg-slate-100 text-slate-600";
  }

  if (status.toLowerCase() === "due soon") {
    return "bg-amber-50 text-amber-600";
  }

  return "bg-sky-50 text-sky-600";
}

function formatCurrency(amount: number | string) {
  const numericValue =
    typeof amount === "string" ? Number.parseFloat(amount) : amount;

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(Number.isNaN(numericValue) ? 0 : numericValue);
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterOption>("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formState, setFormState] = useState<InvoiceFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function refreshData() {
    setIsLoading(true);
    setError("");

    try {
      const [invoiceData, clientData] = await Promise.all([
        getInvoices(),
        getClients(),
      ]);

      setInvoices(invoiceData);
      setClients(clientData);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load invoices.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        const [invoiceData, clientData] = await Promise.all([
          getInvoices(),
          getClients(),
        ]);

        if (!isMounted) {
          return;
        }

        setInvoices(invoiceData);
        setClients(clientData);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load invoices.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredInvoices = useMemo(() => {
    if (activeFilter === "All") {
      return invoices;
    }

    if (activeFilter === "Due Soon") {
      return invoices.filter(isDueSoon);
    }

    return invoices.filter(
      (invoice) => invoice.status.toLowerCase() === activeFilter.toLowerCase(),
    );
  }, [activeFilter, invoices]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      await createInvoice({
        client_id: Number(formState.client_id),
        invoice_number: formState.invoice_number,
        amount: Number(formState.amount),
        issue_date: formState.issue_date,
        due_date: formState.due_date,
        status: formState.status,
        description: formState.description,
        paid_date:
          formState.status === "paid" && formState.paid_date
            ? formState.paid_date
            : undefined,
      });
      setFormState(initialFormState);
      setIsFormOpen(false);
      await refreshData();
    } catch (createError) {
      setSubmitError(
        createError instanceof Error
          ? createError.message
          : "Unable to create invoice.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.10),_transparent_30%),linear-gradient(to_bottom,_#f8fafc,_#eef2f7)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:flex-row lg:px-8">
        <OrivahSidebar activeItem="Invoices" />

        <section className="flex-1">
          <div className="rounded-[32px] border border-slate-200 bg-white/90 p-5 shadow-sm shadow-slate-200/50 backdrop-blur sm:p-6 lg:p-8">
            <header className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-sky-600">
                  Invoice pipeline
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                  Invoices
                </h1>
              </div>
              <button
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                type="button"
                onClick={() => setIsFormOpen((open) => !open)}
              >
                Add Invoice
              </button>
            </header>

            {isFormOpen ? (
              <form
                className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 p-5"
                onSubmit={handleSubmit}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <select
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-300"
                    value={formState.client_id}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        client_id: event.target.value,
                      }))
                    }
                    required
                  >
                    <option value="">Select client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                  <input
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-300"
                    placeholder="Invoice number"
                    value={formState.invoice_number}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        invoice_number: event.target.value,
                      }))
                    }
                    required
                  />
                  <input
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-300"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Amount"
                    value={formState.amount}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        amount: event.target.value,
                      }))
                    }
                    required
                  />
                  <select
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-300"
                    value={formState.status}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        status: event.target.value as InvoiceFormState["status"],
                      }))
                    }
                    required
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                  <label className="block">
                    <span className="mb-2 block text-sm text-slate-500">
                      Issue date
                    </span>
                    <input
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-300"
                      type="date"
                      value={formState.issue_date}
                      onChange={(event) =>
                        setFormState((current) => ({
                          ...current,
                          issue_date: event.target.value,
                        }))
                      }
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm text-slate-500">
                      Due date
                    </span>
                    <input
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-300"
                      type="date"
                      value={formState.due_date}
                      onChange={(event) =>
                        setFormState((current) => ({
                          ...current,
                          due_date: event.target.value,
                        }))
                      }
                      required
                    />
                  </label>
                </div>

                {formState.status === "paid" ? (
                  <label className="mt-4 block">
                    <span className="mb-2 block text-sm text-slate-500">
                      Paid date
                    </span>
                    <input
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-300"
                      type="date"
                      value={formState.paid_date}
                      onChange={(event) =>
                        setFormState((current) => ({
                          ...current,
                          paid_date: event.target.value,
                        }))
                      }
                    />
                  </label>
                ) : null}

                <textarea
                  className="mt-4 min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-300"
                  placeholder="Description"
                  value={formState.description}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  required
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
                    {isSubmitting ? "Saving invoice..." : "Save invoice"}
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

            <div className="mt-8 flex flex-wrap gap-3">
              {filters.map((filter) => (
                <button
                  key={filter}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    filter === activeFilter
                      ? "bg-slate-950 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950"
                  }`}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 px-5 py-8 text-sm text-slate-500">
                Loading invoices...
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
                        <th className="px-5 py-4 font-medium">Invoice number</th>
                        <th className="px-5 py-4 font-medium">Client</th>
                        <th className="px-5 py-4 font-medium">Amount</th>
                        <th className="px-5 py-4 font-medium">Due date</th>
                        <th className="px-5 py-4 font-medium">Status</th>
                        <th className="px-5 py-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInvoices.map((invoice) => {
                        const clientName =
                          clients.find((client) => client.id === invoice.client_id)
                            ?.name ?? `Client #${invoice.client_id}`;
                        const displayStatus = getDisplayStatus(invoice);

                        return (
                          <tr
                            key={invoice.id}
                            className="border-b border-slate-100 last:border-none"
                          >
                            <td className="px-5 py-4 font-medium text-slate-950">
                              {invoice.invoice_number}
                            </td>
                            <td className="px-5 py-4 text-slate-600">
                              {clientName}
                            </td>
                            <td className="px-5 py-4 text-slate-950">
                              {formatCurrency(invoice.amount)}
                            </td>
                            <td className="px-5 py-4 text-slate-600">
                              {formatDate(invoice.due_date)}
                            </td>
                            <td className="px-5 py-4">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
                                  displayStatus,
                                )}`}
                              >
                                {displayStatus}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex flex-wrap gap-3 text-sm font-medium">
                                <button
                                  className="text-sky-600 transition hover:text-sky-700"
                                  type="button"
                                >
                                  View
                                </button>
                                <button
                                  className="text-slate-500 transition hover:text-slate-700"
                                  type="button"
                                >
                                  Edit
                                </button>
                              </div>
                            </td>
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
