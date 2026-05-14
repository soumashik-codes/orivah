import Link from "next/link";

const features = [
  {
    title: "Invoice tracking",
    description:
      "Keep every invoice, due date, and payment status in one clean timeline.",
  },
  {
    title: "Overdue detection",
    description:
      "Spot missed payments early with clear flags before cashflow gets tight.",
  },
  {
    title: "Cashflow forecasting",
    description:
      "Project the next 30 days with expected income based on live invoices.",
  },
  {
    title: "Client risk scoring",
    description:
      "See which clients are trending risky based on payment speed and delays.",
  },
  {
    title: "Payment reminder generator",
    description:
      "Create polished follow-up reminders without rewriting the same email.",
  },
  {
    title: "Dashboard insights",
    description:
      "Turn your receivables into a simple daily picture your team can act on.",
  },
] as const;

const steps = [
  {
    label: "01",
    title: "Add your clients",
    description:
      "Set up your client list in minutes and keep payment history attached to every account.",
  },
  {
    label: "02",
    title: "Track invoices and due dates",
    description:
      "Monitor upcoming, paid, and overdue invoices from one shared workflow.",
  },
  {
    label: "03",
    title: "See cashflow forecasts and risk alerts",
    description:
      "Understand what is likely to land this month and which accounts need follow-up.",
  },
] as const;

const pricingPlans = [
  {
    name: "Starter",
    price: "\u00A30",
    subtitle: "For solo freelancers getting paid on time.",
    cta: "Start free",
    featured: false,
    items: ["1 user", "Basic invoice tracking", "Overdue reminders"],
  },
  {
    name: "Pro",
    price: "\u00A324",
    subtitle: "For growing businesses that want forecasting and visibility.",
    cta: "Choose Pro",
    featured: true,
    items: ["Up to 5 users", "Cashflow forecasting", "Client risk scoring"],
  },
  {
    name: "Team",
    price: "\u00A369",
    subtitle: "For teams managing multiple clients and payment workflows.",
    cta: "Talk to sales",
    featured: false,
    items: ["Unlimited users", "Shared dashboards", "Priority support"],
  },
] as const;

const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Sign in", href: "/login" },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_35%),linear-gradient(to_bottom,_#ffffff,_#f3f4f6)] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10">
        <nav className="flex items-center justify-between rounded-full border border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm shadow-slate-200/50 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-sm font-semibold text-white shadow-lg shadow-sky-200">
              O
            </div>
            <span className="text-lg font-semibold tracking-tight text-slate-950">
              Orivah
            </span>
          </div>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a className="transition hover:text-slate-950" href="#features">
              Features
            </a>
            <a className="transition hover:text-slate-950" href="#how-it-works">
              How it works
            </a>
            <a className="transition hover:text-slate-950" href="#pricing">
              Pricing
            </a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              className="hidden text-sm font-medium text-slate-600 transition hover:text-slate-950 sm:inline-flex"
              href="/login"
            >
              Sign in
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 sm:px-5"
              href="/login"
            >
              Start free
            </Link>
          </div>
        </nav>

        <section className="flex flex-1 items-center py-14 sm:py-20">
          <div className="mx-auto grid w-full items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full border border-sky-100 bg-white px-4 py-2 text-sm font-medium text-sky-700 shadow-sm">
                Built for UK freelancers &amp; small teams
              </div>

              <h1 className="mt-8 max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Stop guessing when your{" "}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
                  clients will pay
                </span>
                .
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Orivah helps freelancers and small businesses track invoices,
                forecast cashflow, and spot late-payment risk before it becomes
                a problem.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-600"
                  href="/login"
                >
                  Start free
                </Link>
                <Link
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                  href="/dashboard"
                >
                  View demo
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-x-8 top-6 h-32 rounded-full bg-sky-200/50 blur-3xl" />
              <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-5 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.25)] sm:p-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      Cashflow dashboard
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Live invoice health for May
                    </p>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                    Sync active
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Outstanding</p>
                    <p className="mt-3 text-2xl font-semibold text-slate-950">
                      &pound;4,850
                    </p>
                  </div>
                  <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4">
                    <p className="text-sm text-rose-500">Overdue</p>
                    <p className="mt-3 text-2xl font-semibold text-slate-950">
                      &pound;1,200
                    </p>
                  </div>
                  <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
                    <p className="text-sm text-sky-600">Expected (30d)</p>
                    <p className="mt-3 text-2xl font-semibold text-slate-950">
                      &pound;3,400
                    </p>
                  </div>
                  <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                    <p className="text-sm text-amber-600">Risk</p>
                    <p className="mt-3 text-2xl font-semibold text-slate-950">
                      Medium
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Late-payment risk</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">
                        3 invoices need attention this week
                      </p>
                    </div>
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="rounded-[40px] border border-slate-200/80 bg-white/80 px-6 py-12 shadow-sm shadow-slate-200/40 backdrop-blur sm:px-8 lg:px-10"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
              Features
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Everything you need to stay ahead of late payments.
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Orivah gives freelancers and small teams a clearer view of what
              is due, what is slipping, and what to do next.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-sky-200 hover:bg-white hover:shadow-lg hover:shadow-sky-100/60"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 text-sm font-semibold text-white">
                  {feature.title.charAt(0)}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-950">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="how-it-works"
          className="grid gap-8 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-start"
        >
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
              How it works
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              A calmer receivables workflow in three simple steps.
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              From setup to forecasting, the product is designed to feel fast,
              practical, and easy to trust.
            </p>
          </div>

          <div className="grid gap-4">
            {steps.map((step) => (
              <div
                key={step.label}
                className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sm font-semibold text-sky-700">
                    {step.label}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-950">
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="pricing"
          className="rounded-[40px] border border-slate-200 bg-slate-950 px-6 py-12 text-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)] sm:px-8 lg:px-10"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Pricing
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Choose the plan that fits the way you manage cashflow.
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-300">
              Start simple, then grow into deeper forecasting and collaboration
              as your client base expands.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-[28px] border p-6 ${
                  plan.featured
                    ? "border-cyan-300/50 bg-white text-slate-950 shadow-xl shadow-cyan-500/10"
                    : "border-white/10 bg-white/5 text-white"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    <p
                      className={`mt-3 text-sm leading-7 ${
                        plan.featured ? "text-slate-600" : "text-slate-300"
                      }`}
                    >
                      {plan.subtitle}
                    </p>
                  </div>
                  {plan.featured ? (
                    <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                      Popular
                    </span>
                  ) : null}
                </div>

                <div className="mt-8 flex items-end gap-2">
                  <span className="text-4xl font-semibold">{plan.price}</span>
                  <span
                    className={`pb-1 text-sm ${
                      plan.featured ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    /month
                  </span>
                </div>

                <div className="mt-8 space-y-3">
                  {plan.items.map((item) => (
                    <div
                      key={item}
                      className={`rounded-2xl border px-4 py-3 text-sm ${
                        plan.featured
                          ? "border-slate-200 bg-slate-50 text-slate-700"
                          : "border-white/10 bg-white/5 text-slate-200"
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <a
                  className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                    plan.featured
                      ? "bg-slate-950 text-white hover:bg-slate-800"
                      : "border border-white/15 bg-white text-slate-950 hover:bg-slate-100"
                  }`}
                  href="#start"
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 py-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-sm font-semibold text-white shadow-lg shadow-sky-200">
                O
              </div>
              <div>
                <p className="text-base font-semibold text-slate-950">Orivah</p>
                <p className="text-sm text-slate-500">
                  Cashflow clarity for modern service businesses.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-5 text-sm text-slate-600">
              {footerLinks.map((link) => (
                <a
                  key={link.label}
                  className="transition hover:text-slate-950"
                  href={link.href}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
