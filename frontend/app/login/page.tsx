"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { loginUser } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await loginUser(email, password);
      router.push("/dashboard");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to sign in right now.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_35%),linear-gradient(to_bottom,_#ffffff,_#f3f4f6)] px-6 py-6 text-slate-900 sm:px-8 lg:px-10">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col">
        <nav className="flex items-center justify-between rounded-full border border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm shadow-slate-200/50 backdrop-blur sm:px-6">
          <Link className="flex items-center gap-3" href="/">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-sm font-semibold text-white shadow-lg shadow-sky-200">
              O
            </div>
            <span className="text-lg font-semibold tracking-tight text-slate-950">
              Orivah
            </span>
          </Link>

          <Link
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            href="/"
          >
            Back to home
          </Link>
        </nav>

        <section className="flex flex-1 items-center justify-center py-14 sm:py-20">
          <div className="grid w-full max-w-6xl gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center rounded-full border border-sky-100 bg-white px-4 py-2 text-sm font-medium text-sky-700 shadow-sm">
                Secure sign in for your cashflow workspace
              </div>
              <h1 className="mt-8 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Pick up right where your receivables left off.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                Sign in to review live invoice status, check overdue accounts,
                and keep your next 30 days in focus.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40">
                  <p className="text-sm text-slate-500">Outstanding</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-950">
                    {"\u00A34,850"}
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40">
                  <p className="text-sm text-slate-500">Overdue</p>
                  <p className="mt-3 text-2xl font-semibold text-rose-600">
                    {"\u00A31,200"}
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40">
                  <p className="text-sm text-slate-500">Forecast</p>
                  <p className="mt-3 text-2xl font-semibold text-sky-600">
                    30d view
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.25)] sm:p-8">
              <div>
                <p className="text-sm font-medium text-sky-600">Welcome back</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                  Sign in
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-500">
                  Use your Orivah account to access clients, invoices, and live
                  dashboard insights.
                </p>
              </div>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </span>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@company.com"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </span>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </label>

                {error ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                    {error}
                  </div>
                ) : null}

                <button
                  className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
