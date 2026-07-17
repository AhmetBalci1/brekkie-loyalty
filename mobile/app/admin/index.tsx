import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";

import {
  useEffect,
  useState,
} from "react";
import AsyncStorage
from "@react-native-async-storage/async-storage";

import { router }
from "expo-router";
import KPICard from "../components/admin/KPICard";
import QuickActionCard from "../components/admin/QuickActionCard";
import DashboardHeader from "../components/admin/DashboardHeader";
import RecentActivity from "../components/admin/RecentActivity";
import AuditLog from "../components/admin/AuditLog";

export default function AdminScreen() {
   const [authorized,
setAuthorized] =
useState(false);
useEffect(() => {

  const checkStaff =
    async () => {

    const isStaff =
      await AsyncStorage.getItem(
        "staff"
      );

    if (!isStaff) {

      router.replace(
        "/" as any
      );

      return;
    }

    setAuthorized(true);
  };

  checkStaff();

}, []);
  const [analytics, setAnalytics] =
  useState<any>(null);
 

useEffect(() => {

  fetch(
    "https://brekkie-api.onrender.com/analytics"
  )
    .then((res) => res.json())
    .then((data) => {

      setAnalytics(data);

    })
    .catch((err) => {
      console.log(err);
    });

}, []);

if (!authorized) {

  return null;
}
  return (

    

    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 40,
      }}
      showsVerticalScrollIndicator={false}
    >
      <DashboardHeader />
      
<View style={styles.statsRow}>
  <KPICard
    value={analytics?.users || 0}
    label="👥 Kullanıcılar"
  />

  <KPICard
    value={analytics?.scans || 0}
    label="☕ Scans"
  />
</View>

<View style={styles.statsRow}>
  <KPICard
    value={analytics?.rewards || 0}
    label="🎁 Ödüller"
  />

  <KPICard
    value={`₺${analytics?.revenue || 0}`}
    label="💰 Hasılat"
  />
</View>
      <View style={styles.activityCard}>

        <Text style={styles.activityTitle}>
          En iyi Üye 👑
        </Text>

        <Text style={styles.customerName}>
          {analytics?.topCustomer?.name ||
           "No Customer"}
        </Text>

        <Text style={styles.customerStats}>
      <View style={{ marginTop: 12 }}>

  <Text style={styles.customerStats}>
    ☕ {analytics?.topCustomer?.coffee_count || 0} Kahveler
  </Text>

  <Text style={styles.customerStats}>
    🎁 {analytics?.topCustomer?.free_coffee || 0} Ödüller
  </Text>

</View>
        </Text>
<Text style={styles.sectionTitle}>
Quick Actions
</Text>

<View style={styles.quickGrid}>

  <QuickActionCard
    icon="🔔"
    title="Bildirimler"
    onPress={() => router.push("/admin/notifications")}
  />

  <QuickActionCard
    icon="👥"
    title="Kullanıcılar"
    onPress={() => router.push("/admin/members")}
  />

  <QuickActionCard
    icon="🎁"
    title="Kampanyalar"
    onPress={() => router.push("/admin/campaigns")}
  />

  <QuickActionCard
    icon="⚙️"
    title="Ayarlar"
    onPress={() => router.push("/admin/settings")}
  />
<QuickActionCard
  icon="👨‍🍳"
  title="Personeller"
  onPress={() => router.push("/admin/staff")}
/>
</View>
      </View>
<RecentActivity />
<AuditLog />
      <TouchableOpacity
  style={styles.logoutButton}
  onPress={async () => {

  await AsyncStorage.multiRemove([
  "staff",
  "staffId",
  "staffName",
  "staffRole",
]);

    router.replace(
      "/staff-login" as any
    );
  }}
>
  <Text style={styles.logoutText}>
    Çıkış Yap
  </Text>
</TouchableOpacity>

    </ScrollView>
    
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,

    backgroundColor: "#F8F5F0", // Eski: #e9dfcf
  },

  subtitle: {
    color: "#8A8178", // Eski: #0b5d38

    fontSize: 16,

    marginTop: 6,

    marginBottom: 30,
  },

  statsRow: {
    flexDirection: "row",

    justifyContent: "space-between",

    marginBottom: 16,
  },

  activityCard: {
    backgroundColor: "#FFFFFF", // Eski: #004225

    borderRadius: 28,

    padding: 24,

    marginTop: 12,

    borderWidth: 1,
    borderColor: "#EADBC8",

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.08,

    shadowRadius: 12,

    elevation: 6,
  },

  activityTitle: {
    color: "#C97C4A", // Eski: #d4af37

    fontSize: 18,

    fontWeight: "900",

    marginBottom: 18,
  },

  customerName: {
    color: "#262626", // Eski: #fff4e3

    fontSize: 28,

    fontWeight: "900",

    marginBottom: 8,
  },

  customerStats: {
    color: "#8A8178", // Eski: #d4af37

    fontSize: 16,

    fontWeight: "600",
  },

  activityText: {
    color: "#555555", // Eski: #fff4e3

    fontSize: 15,

    marginBottom: 10,

    lineHeight: 22,
  },

  logoutButton: {
    marginTop: 20,

    backgroundColor: "#D9534F", // Eski: #7a1f1f

    paddingVertical: 18,

    borderRadius: 22,

    alignItems: "center",
  },

  logoutText: {
    color: "#FFFFFF",

    fontSize: 16,

    fontWeight: "900",
  },

  sectionTitle: {

    fontSize: 22,

    fontWeight: "800",

    color: "#262626", // Eski: #004225

    marginTop: 30,

    marginBottom: 18,

  },

  quickGrid: {

    flexDirection: "row",

    flexWrap: "wrap",

    justifyContent: "space-between",

  },

});