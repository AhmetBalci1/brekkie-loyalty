export default function StoreStatus() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="text-lg font-semibold text-slate-900">

        Şube Durumu

      </h2>

      <div className="mt-6 space-y-4">

        <Store name="Brekkie Moda" active />

        <Store name="Brekkie Suadiye" active />

        <Store name="Brekkie Kadıköy" active={false} />

      </div>

    </div>
  );
}

function Store({
  name,
  active,
}: {
  name: string;
  active: boolean;
}) {
  return (
    <div className="flex justify-between items-center">

      <p className="text-slate-700">

        {name}

      </p>

      <div
        className={`h-3 w-3 rounded-full ${
          active
            ? "bg-green-500"
            : "bg-red-500"
        }`}
      />

    </div>
  );
}