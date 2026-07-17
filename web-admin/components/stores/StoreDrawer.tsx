import { Store } from "../../types/store";
import { useEffect, useState } from "react";
import {
  createStore,
  updateStore,
} from "../../services/api";
import toast from "react-hot-toast";
import StoreForm from "./StoreForm";
type Props = {
  open: boolean;
  store: Store | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function StoreDrawer({
  open,
  store,
  onClose,
  onSaved,
}: Props) { 
const [form, setForm] = useState({
  name: "",
  address: "",
  latitude: 0,
  longitude: 0,
  radius: 250,
  is_active: true,
});
useEffect(() => {
  if (store) {
    setForm({
      name: store.name,
      address: store.address,
      latitude: store.latitude,
      longitude: store.longitude,
      radius: store.radius,
      is_active: store.is_active,
    });
  } else {
    setForm({
      name: "",
      address: "",
      latitude: 0,
      longitude: 0,
      radius: 250,
      is_active: true,
    });
  }
}, [store]);
const handleSave = async () => {
  try {
    if (store) {
      await updateStore(store.id, {
        ...store,
        ...form,
      });

      toast.success("Şube başarıyla güncellendi.");
    } else {
      await createStore(form);

      toast.success("Şube başarıyla oluşturuldu.");
    }

    onSaved();
    onClose();

  } catch (error) {
    console.error(error);
    toast.error("İşlem başarısız.");
  }
};
if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">

      <div className="w-[500px] h-full bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b p-6">

         <h2 className="text-2xl font-semibold">
  {store ? "Şube Düzenle" : "Yeni Şube"}
</h2>

          <button
            onClick={onClose}
            className="text-3xl text-slate-500 hover:text-black"
          >
            ×
          </button>

        </div>
<StoreForm
  form={form}
  setForm={setForm}
/>
        
<div className="mt-8">

  <button
  onClick={handleSave}
  className="w-full rounded-xl bg-blue-600 py-3 text-white hover:bg-blue-700 transition"
>
  Kaydet
</button>

</div>
      </div>

    </div>
    
  );
}