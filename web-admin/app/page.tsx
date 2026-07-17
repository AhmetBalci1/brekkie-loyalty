"use client";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/ui/Card";
import RecentActivity from "../components/dashboard/RecentActivity";
import StoreStatus from "../components/dashboard/StoreStatus";
import { useEffect, useState } from "react";
import { getStores } from "../services/api";
import {
  Users,
  Store,
  Gift,
  ScanLine,
} from "lucide-react";

export default function Home() {
  const [stores, setStores] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
useEffect(() => {

  async function loadStores() {

    try {

    const data = await getStores();

console.log("STORES:", data);

setStores(data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  }

  loadStores();

}, []);
  return (
    <MainLayout
  title="Ana Panel"
  subtitle="İşletmenizin genel durumunu görüntüleyin."
>

      <div className="grid grid-cols-4 gap-6">

        <Card
          title="Toplam Üye"
          value="1,248"
          subtitle="+18% bu ay"
          icon={<Users size={22} />}
        />

        <Card
          title="Şubeler"
          value="8"
          subtitle="7 aktif"
          icon={<Store size={22} />}
        />

        <Card
          title="Kampanyalar"
          value="4"
          subtitle="2 aktif"
          icon={<Gift size={22} />}
        />

        <Card
          title="Bugünkü Tarama"
          value="327"
          subtitle="Canlı veri"
          icon={<ScanLine size={22} />}
        />

      </div>
      
      <div className="mt-8 grid grid-cols-3 gap-6">

  <div className="col-span-2">

    <RecentActivity />

  </div>

  <StoreStatus />

</div>
<div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">

  <h2 className="mb-4 text-xl font-semibold">

    Şubeler

  </h2>

  {loading ? (

    <p>Yükleniyor...</p>

  ) : (

    stores.map((store) => (

      <div
        key={store.id}
        className="mb-4 rounded-xl border border-slate-200 p-4"
      >

        <h3 className="font-semibold">

          {store.name}

        </h3>

        <p className="text-sm text-slate-500">

          {store.address}

        </p>

        <p className="text-sm">

          Radius: {store.radius} metre

        </p>

      </div>

    ))

  )}

</div>
    </MainLayout>
    
  );
  
}