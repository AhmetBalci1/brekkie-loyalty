import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const GEOFENCE_TASK = "brekkie-geofence-task";

TaskManager.defineTask(
  GEOFENCE_TASK,
  async ({ data, error }: any) => {

    if (error) {
      console.log("❌ Geofence Error:", error);
      return;
    }

    const { eventType, region } = data;

    console.log("📍 EVENT TYPE:", eventType);
    console.log("📍 REGION:", region);

   if (eventType === Location.GeofencingEventType.Enter) {
  console.log("✅ MAĞAZAYA GİRİLDİ");
const lastNotification =
  await AsyncStorage.getItem("lastGeofenceNotification");

const now = Date.now();

const THIRTY_MINUTES = 30 * 60 * 1000;

if (
  !lastNotification ||
  now - Number(lastNotification) > THIRTY_MINUTES
) {
  // 📍 Telefona kaydettiğimiz şubeleri oku
  const storesJson = await AsyncStorage.getItem(
    "brekkie_stores"
  );

  const stores = storesJson
    ? JSON.parse(storesJson)
    : [];

  // 📍 Geofence'e girilen şubeyi bul
  const store = stores.find(
    (s: any) =>
      String(s.id) === region.identifier
  );

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `☕ ${store?.name ?? "Brekkie"}'ye Hoş Geldin!`,
      body: "Bugünkü Ne İçmek İstersin? 🎉",
      sound: true,
    },
    trigger: null,
  });

  await AsyncStorage.setItem(
    "lastGeofenceNotification",
    now.toString()
  );
} else {
  console.log("🔕 Bildirim gönderilmedi (30 dakika dolmadı).");
}
}

    if (eventType === Location.GeofencingEventType.Exit) {
      console.log("🚪 MAĞAZADAN ÇIKILDI");
    }
  }
);