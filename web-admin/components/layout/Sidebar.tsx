import Link from "next/link";
import {
  LayoutDashboard,
  Store,
  Gift,
  Users,
  Bell,
  ChartColumn,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-72 h-screen bg-[#11151C] text-white border-r border-[#252B36]">

      <div className="p-6 border-b border-[#252B36]">

        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
          B
        </div>

        <h1 className="mt-5 text-xl font-semibold tracking-tight">
          Business Suite
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Management Platform
        </p>

      </div>

      <nav className="p-4 space-y-2">

        <Link href="/">
          <MenuItem
            icon={<LayoutDashboard size={20} />}
            title="Dashboard"
          />
        </Link>

        <Link href="/stores">
          <MenuItem
            icon={<Store size={20} />}
            title="Şubeler"
          />
        </Link>

        <Link href="/campaigns">
          <MenuItem
            icon={<Gift size={20} />}
            title="Kampanyalar"
          />
        </Link>

        <Link href="/staff">
          <MenuItem
            icon={<Users size={20} />}
            title="Personeller"
          />
        </Link>

        <Link href="/notifications">
          <MenuItem
            icon={<Bell size={20} />}
            title="Bildirimler"
          />
        </Link>

        <Link href="/analytics">
          <MenuItem
            icon={<ChartColumn size={20} />}
            title="Analitik"
          />
        </Link>

        <Link href="/settings">
          <MenuItem
            icon={<Settings size={20} />}
            title="Ayarlar"
          />
        </Link>

      </nav>

    </aside>
  );
}

function MenuItem({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer">

      {icon}

      <span>{title}</span>

    </div>
  );
}