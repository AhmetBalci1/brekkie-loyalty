import * as Location from "expo-location";
import { getStores } from "./api";
import { GEOFENCE_TASK } from "../tasks/geofenceTask";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function initializeLocation() {

  // Ön planda konum izni
  const { status: foregroundStatus } =
    await Location.requestForegroundPermissionsAsync();

  if (foregroundStatus !== "granted") {

    console.log("❌ Ön plan konum izni verilmedi.");

    return;

  }

  // Arka planda konum izni
  const { status: backgroundStatus } =
    await Location.requestBackgroundPermissionsAsync();

  if (backgroundStatus !== "granted") {

    console.log("❌ Arka plan konum izni verilmedi.");

    return;

  }

  console.log("✅ Tüm konum izinleri alındı.");

  const stores = await getStores();

  console.log("📍 STORES:", stores);
  await AsyncStorage.setItem(
  "brekkie_stores",
  JSON.stringify(stores)
);

  const regions = stores.map((store: any) => ({

    identifier: String(store.id),

    latitude: store.latitude,

    longitude: store.longitude,

    radius: store.radius,

    notifyOnEnter: true,

    notifyOnExit: false,

  }));

  console.log("📍 REGIONS:", regions);

  await Location.startGeofencingAsync(
    GEOFENCE_TASK,
    regions
  );

  console.log("✅ Geofence kayıt edildi.");
}