type HeaderProps = {
  title: string;
  subtitle: string;
};

import { Bell, Search } from "lucide-react";

export default function Header({
  title,
  subtitle,
}: HeaderProps) {
  return (
    <header className="h-24 bg-white border-b border-slate-200 flex items-center justify-between px-10">

      <div>

        <h1 className="text-3xl font-bold text-slate-900">
          {title}
        </h1>

        <p className="text-slate-500 mt-1">
          {subtitle}
        </p>

      </div>

      <div className="flex items-center gap-4">

        <button className="w-11 h-11 rounded-xl border border-slate-200 hover:bg-slate-100">
          <Search className="mx-auto" size={18} />
        </button>

        <button className="w-11 h-11 rounded-xl border border-slate-200 hover:bg-slate-100">
          <Bell className="mx-auto" size={18} />
        </button>

        <div className="h-11 w-px bg-slate-200"/>

        <div>

          <p className="font-semibold">
            Ahmet Balcı
          </p>

          <p className="text-sm text-slate-500">
            Platform Admin
          </p>

        </div>

      </div>

    </header>
  );
}