export default function RecentActivity() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="text-lg font-semibold text-slate-900">
        Son Aktiviteler
      </h2>

      <div className="mt-6 space-y-4">

        <Activity
          title="Ahmet Balcı"
          text="1 kahve kazandı"
          time="2 dk önce"
        />

        <Activity
          title="Mehmet"
          text="Ödül kahvesini kullandı"
          time="8 dk önce"
        />

        <Activity
          title="Ayşe"
          text="Sadakat kartına giriş yaptı"
          time="15 dk önce"
        />

        <Activity
          title="Fatma"
          text="Yeni üye oldu"
          time="21 dk önce"
        />

      </div>

    </div>
  );
}

function Activity({
  title,
  text,
  time,
}: {
  title: string;
  text: string;
  time: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3">

      <div>

        <p className="font-medium text-slate-900">

          {title}

        </p>

        <p className="text-sm text-slate-500">

          {text}

        </p>

      </div>

      <span className="text-xs text-slate-400">

        {time}

      </span>

    </div>
  );
}