"use client";
import { Store } from "../../types/store";
import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import {
  getStores,
  deleteStore,
} from "../../services/api";
import StoreDrawer from "../../components/stores/StoreDrawer";
import StoreCard from "../../components/stores/StoreCard";
import toast from "react-hot-toast";

export default function StoresPage() {

  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
const [drawerOpen, setDrawerOpen] = useState(false);

  const loadStores = async () => {
  const data = await getStores();
  setStores(data);
};

useEffect(() => {
  loadStores();
  
}, []);
const handleDelete = async (store: Store) => {
  const confirmed = window.confirm(
    `"${store.name}" şubesini silmek istediğinize emin misiniz?`
  );

  if (!confirmed) return;

  try {
    await deleteStore(store.id);

    toast.success("Şube başarıyla silindi.");

    await loadStores();
  } catch (error) {
    console.error(error);
    toast.error("Şube silinemedi.");
  }
};
  return (

    <MainLayout
  title="Şubeler"
  subtitle="İşletmenize ait tüm şubeleri yönetin."
>

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-3xl font-bold">

            Şubeler

          </h1>

          <p className="text-slate-500">

            İşletmenize ait tüm şubeler

          </p>

        </div>

     <button
  onClick={() => {
    setSelectedStore(null);
    setDrawerOpen(true);
  }}
  className="rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
>
  + Yeni Şube
</button>

      </div>

      <div className="space-y-5">

       {stores.map((store) => (

 <StoreCard
  key={store.id}
  store={store}
  onEdit={() => {
    setSelectedStore(store);
    setDrawerOpen(true);
  }}
  onDelete={() => handleDelete(store)}
/>

))}

      </div>
<StoreDrawer
  open={drawerOpen}
  store={selectedStore}
  onClose={() => setDrawerOpen(false)}
  onSaved={loadStores}
/>
    </MainLayout>

  );

}