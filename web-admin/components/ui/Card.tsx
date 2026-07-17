import { ReactNode } from "react";

type CardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
};

export default function Card({
  title,
  value,
  subtitle,
  icon,
}: CardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            {value}
          </h2>

          {subtitle && (
            <p className="mt-3 text-sm text-slate-400">
              {subtitle}
            </p>
          )}

        </div>

        {icon && (

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">

            {icon}

          </div>

        )}

      </div>

    </div>
  );
}