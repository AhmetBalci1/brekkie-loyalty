import { MapPin, Pencil, Trash2 } from "lucide-react";

type Props = {
  store: any;
  onEdit: () => void;
  onDelete: () => void;
};

export default function StoreCard({
  store,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex justify-between">

        <div>

          <div className="flex items-center gap-2">

            <MapPin
              size={18}
              className="text-blue-600"
            />

            <h2 className="text-xl font-semibold">

              {store.name}

            </h2>

          </div>

          <p className="mt-2 text-slate-500">

            {store.address}

          </p>

          <p className="mt-2 text-sm">

            Radius: {store.radius} metre

          </p>

        </div>

       <div className="flex gap-3">

  <button
    onClick={onEdit}
    className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 hover:bg-slate-100"
  >
    <Pencil size={16} />
    Düzenle
  </button>

  <button
    onClick={onDelete}
    className="flex h-10 items-center gap-2 rounded-lg border border-red-200 px-4 text-red-600 hover:bg-red-50"
  >
    <Trash2 size={16} />
    Sil
  </button>

</div>

      </div>

    </div>
  );
}