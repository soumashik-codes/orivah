import Link from "next/link";

type NavItem = {
  href: string;
  label: string;
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/clients", label: "Clients" },
  { href: "/invoices", label: "Invoices" },
  { href: "#", label: "Forecast" },
  { href: "#", label: "Settings" },
];

type OrivahSidebarProps = {
  activeItem: string;
};

export function OrivahSidebar({ activeItem }: OrivahSidebarProps) {
  return (
    <aside className="w-full rounded-[32px] border border-slate-200 bg-white/90 p-5 shadow-sm shadow-slate-200/50 backdrop-blur lg:min-h-[calc(100vh-2rem)] lg:w-72 lg:p-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-sm font-semibold text-white shadow-lg shadow-sky-200">
          O
        </div>
        <div>
          <p className="text-base font-semibold text-slate-950">Orivah</p>
          <p className="text-sm text-slate-500">Fintech workspace</p>
        </div>
      </div>

      <nav className="mt-6 grid gap-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
              item.label === activeItem
                ? "bg-slate-950 text-white shadow-lg shadow-slate-300/40"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
            }`}
            href={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8 rounded-3xl border border-sky-100 bg-sky-50 p-5">
        <p className="text-sm font-semibold text-sky-700">Cashflow pulse</p>
        <p className="mt-3 text-2xl font-semibold text-slate-950">82%</p>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Forecast confidence is strong across the next 30 days.
        </p>
      </div>
    </aside>
  );
}
