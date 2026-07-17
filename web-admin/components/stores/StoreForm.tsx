import StoreMap from "./StoreMap";
type Props = {
  form: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    radius: number;
    is_active: boolean;
  };

  setForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      address: string;
      latitude: number;
      longitude: number;
      radius: number;
      is_active: boolean;
    }>
  >;
};
export default function StoreForm({
  form,
  setForm,
}: Props) {
  return (
    
    <>
    <div className="p-6 space-y-6">

          <div>

            <label className="text-sm text-slate-500">
              Şube Adı
            </label>

            <input
  value={form.name}
  onChange={(e) =>
    setForm({
      ...form,
      name: e.target.value,
    })
  }
  className="mt-2 w-full rounded-xl border border-slate-300 p-3"
/>

          </div>

          <div>

            <label className="text-sm text-slate-500">
              Adres
            </label>
           

           <input
  value={form.address}
  onChange={(e) =>
    setForm({
      ...form,
      address: e.target.value,
    })
  }
  className="mt-2 w-full rounded-xl border border-slate-300 p-3"
/>
          </div>
 <div>

  <label className="text-sm text-slate-500">
    Latitude
  </label>

  <input
    type="number"
    value={form.latitude}
    onChange={(e) =>
      setForm({
        ...form,
        latitude: Number(e.target.value),
      })
    }
    className="mt-2 w-full rounded-xl border border-slate-300 p-3"
  />

</div>

<div>

  <label className="text-sm text-slate-500">
    Longitude
  </label>

  <input
    type="number"
    value={form.longitude}
    onChange={(e) =>
      setForm({
        ...form,
        longitude: Number(e.target.value),
      })
    }
    className="mt-2 w-full rounded-xl border border-slate-300 p-3"
  />

</div>
<StoreMap
  latitude={form.latitude}
  longitude={form.longitude}
  onLocationChange={(lat, lng) =>
    setForm({
      ...form,
      latitude: lat,
      longitude: lng,
    })
  }
/>
          <div>

            <label className="text-sm text-slate-500">
              Radius
            </label>

            <input
  type="number"
  value={form.radius}
  onChange={(e) =>
    setForm({
      ...form,
      radius: Number(e.target.value),
    })
  }
  className="mt-2 w-full rounded-xl border border-slate-300 p-3"
/>
<div>

  <label className="text-sm text-slate-500">

    Aktif

  </label>

  <div className="mt-3">

    <input
      type="checkbox"
      checked={form.is_active}
      onChange={(e) =>
        setForm({
          ...form,
          is_active: e.target.checked,
        })
      }
    />

  </div>

</div>

          </div>

        </div>
    </>
  );
}