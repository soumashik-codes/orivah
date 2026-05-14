"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { DashboardSummary, getDashboardSummary } from "@/lib/api";

import { OrivahSidebar } from "../_components/orivah-sidebar";

type KpiCard = {
  label: string;
  value: string;
  detail: string;
  tone: string;
};

const recentInvoices = [
  {
    client: "Northshore Studio",
    invoice: "INV-1024",
    due: "16 May",
    amount: "\u00A3850",
    status: "Due soon",
  },
  {
    client: "Alder & Co",
    invoice: "INV-1021",
    due: "11 May",
    amount: "\u00A31,200",
    status: "Overdue",
  },
  {
    client: "Luma Health",
    invoice: "INV-1018",
    due: "22 May",
    amount: "\u00A32,400",
    status: "Scheduled",
  },
  {
    client: "Hearth Digital",
    invoice: "INV-1015",
    due: "07 May",
    amount: "\u00A3640",
    status: "Paid",
  },
] as const;

const riskItems = [
  { client: "Alder & Co", risk: "High", note: "18 days average delay" },
  { client: "Northshore Studio", risk: "Medium", note: "2 reminders sent" },
  { client: "Luma Health", risk: "Low", note: "Pays early consistently" },
] as const;

const forecastBars = [
  { week: "Week 1", amount: "\u00A31.1k", width: "w-4/12" },
  { week: "Week 2", amount: "\u00A32.6k", width: "w-8/12" },
  { week: "Week 3", amount: "\u00A31.9k", width: "w-6/12" },
  { week: "Week 4", amount: "\u00A33.4k", width: "w-11/12" },
] as const;

function formatCurrency(value: number | string | undefined) {
  const numericValue =
    typeof value === "string" ? Number.parseFloat(value) : value ?? 0;

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(Number.isNaN(numericValue) ? 0 : numericValue);
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadSummary() {
      try {
        const data = await getDashboardSummary();
        if (!isMounted) {
          return;
        }
        setSummary(data);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load dashboard summary.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadSummary();

    return () => {
      isMounted = false;
    };
  }, []);

  const kpis = useMemo<KpiCard[]>(() => {
    const safeSummary = summary ?? {};

    return [
      {
        label: "Outstanding",
        value: formatCurrency(safeSummary.outstanding_total),
        detail: "Open invoice value",
        tone: "text-slate-950",
      },
      {
        label: "Overdue",
        value: formatCurrency(safeSummary.overdue_total),
        detail: `${safeSummary.overdue_count ?? 0} invoices overdue`,
        tone: "text-rose-600",
      },
      {
        label: "Expected 30d",
        value: formatCurrency(safeSummary.expected_next_30_days),
        detail: "Projected incoming cash",
        tone: "text-sky-600",
      },
      {
        label: "Paid this month",
        value: formatCurrency(safeSummary.paid_this_month),
        detail: `Risk ${safeSummary.risk_level ?? "Low"}`,
        tone: "text-emerald-600",
      },
    ];
  }, [summary]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.10),_transparent_30%),linear-gradient(to_bottom,_#f8fafc,_#eef2f7)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:flex-row lg:px-8">
        <OrivahSidebar activeItem="Dashboard" />

        <section className="flex-1">
          <div className="rounded-[32px] border border-slate-200 bg-white/90 p-5 shadow-sm shadow-slate-200/50 backdrop-blur sm:p-6 lg:p-8">
            <header className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-sky-600">
                  Welcome back
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                  Dashboard
                </h1>
              </div>
              <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
                Updated 14 May
              </div>
            </header>

            {isLoading ? (
              <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-8 text-sm text-slate-500">
                Loading dashboard summary...
              </div>
            ) : error ? (
              <div className="mt-8 rounded-3xl border border-rose-200 bg-rose-50 px-5 py-8 text-sm text-rose-600">
                {error}
              </div>
            ) : (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {kpis.map((kpi) => (
                  <div
                    key={kpi.label}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <p className="text-sm text-slate-500">{kpi.label}</p>
                    <p className={`mt-4 text-3xl font-semibold ${kpi.tone}`}>
                      {kpi.value}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">{kpi.detail}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
              <div className="rounded-[28px] border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950">
                      Recent invoices
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      A live snapshot of upcoming and overdue payments.
                    </p>
                  </div>
                  <Link className="text-sm font-medium text-sky-600" href="/invoices">
                    View all
                  </Link>
                </div>

                <div className="mt-5 overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="text-slate-500">
                      <tr className="border-b border-slate-100">
                        <th className="pb-3 font-medium">Client</th>
                        <th className="pb-3 font-medium">Invoice</th>
                        <th className="pb-3 font-medium">Due</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentInvoices.map((invoice) => (
                        <tr
                          key={invoice.invoice}
                          className="border-b border-slate-100 last:border-none"
                        >
                          <td className="py-4 font-medium text-slate-950">
                            {invoice.client}
                          </td>
                          <td className="py-4 text-slate-600">
                            {invoice.invoice}
                          </td>
                          <td className="py-4 text-slate-600">{invoice.due}</td>
                          <td className="py-4 text-slate-950">
                            {invoice.amount}
                          </td>
                          <td className="py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                invoice.status === "Overdue"
                                  ? "bg-rose-50 text-rose-600"
                                  : invoice.status === "Paid"
                                    ? "bg-emerald-50 text-emerald-600"
                                    : invoice.status === "Due soon"
                                      ? "bg-amber-50 text-amber-600"
                                      : "bg-sky-50 text-sky-600"
                              }`}
                            >
                              {invoice.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid gap-6">
                <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                  <h2 className="text-xl font-semibold text-slate-950">
                    Client risk summary
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Accounts to monitor this week.
                  </p>

                  <div className="mt-5 space-y-3">
                    {riskItems.map((item) => (
                      <div
                        key={item.client}
                        className="rounded-2xl border border-slate-200 bg-white p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium text-slate-950">
                            {item.client}
                          </p>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              item.risk === "High"
                                ? "bg-rose-50 text-rose-600"
                                : item.risk === "Medium"
                                  ? "bg-amber-50 text-amber-600"
                                  : "bg-emerald-50 text-emerald-600"
                            }`}
                          >
                            {item.risk}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">{item.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-white p-5">
                  <h2 className="text-xl font-semibold text-slate-950">
                    Cashflow forecast
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Expected incoming payments over the next four weeks.
                  </p>

                  <div className="mt-6 space-y-4">
                    {forecastBars.map((bar) => (
                      <div key={bar.week}>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="text-slate-600">{bar.week}</span>
                          <span className="font-medium text-slate-950">
                            {bar.amount}
                          </span>
                        </div>
                        <div className="h-3 rounded-full bg-slate-100">
                          <div
                            className={`h-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 ${bar.width}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
