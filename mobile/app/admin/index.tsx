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

      <View style={styles.header}>

  <View>

    <Text style={styles.greeting}>
      ☀️ Günaydın
    </Text>

    <Text style={styles.title}>
      Brekkie Manager
    </Text>

    <Text style={styles.subtitle}>
      Today is looking great.
    </Text>

  </View>

  <View style={styles.logoContainer}>
    <Text style={styles.logo}>🦝</Text>
  </View>

</View>
      <Text style={styles.subtitle}>
        Business Overview ☕
      </Text>
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

</View>
      </View>

      <View style={styles.activityCard}>

        <Text style={styles.activityTitle}>
          BUGÜNÜN AKTİVİTELERİ
        </Text>
<Text style={styles.activityText}>
  ☕ Günlük Taratılan Qr:
  {analytics?.todayActivity?.scans || 0}
</Text>



<Text style={styles.activityText}>
  🎁 Günlük Verilen Ödüller:
  {analytics?.todayActivity?.rewards || 0}
</Text>



<Text style={styles.activityText}>
  👥 Günlük Yeni Kullanıcı:
  {analytics?.todayActivity?.users || 0}
</Text>
      </View>
      <TouchableOpacity
  style={styles.logoutButton}
  onPress={async () => {

    await AsyncStorage.removeItem(
      "staff"
    );

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

    backgroundColor: "#e9dfcf",
  },

  title: {
    color: "#004225",

    fontSize: 34,

    fontWeight: "900",

    letterSpacing: 2,

    marginTop: 20,
  },

  subtitle: {
    color: "#0b5d38",

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
    backgroundColor: "#004225",

    borderRadius: 28,

    padding: 24,

    marginTop: 12,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.2,

    shadowRadius: 12,

    elevation: 8,
  },

  activityTitle: {
    color: "#d4af37",

    fontSize: 18,

    fontWeight: "900",

    marginBottom: 18,
  },

  customerName: {
    color: "#fff4e3",

    fontSize: 28,

    fontWeight: "900",

    marginBottom: 8,
  },

  customerStats: {
    color: "#d4af37",

    fontSize: 16,

    fontWeight: "600",
  },

  activityText: {
    color: "#fff4e3",

    fontSize: 15,

    marginBottom: 10,

    lineHeight: 22,
  },
  logoutButton: {
  marginTop: 20,

  backgroundColor: "#7a1f1f",

  paddingVertical: 18,

  borderRadius: 22,

  alignItems: "center",
},

logoutText: {
  color: "#fff",

  fontSize: 16,

  fontWeight: "900",
},
header:{

flexDirection:"row",

justifyContent:"space-between",

alignItems:"center",

marginTop:20,

marginBottom:28,

},

greeting:{

fontSize:16,

color:"#7A7A7A",

marginBottom:6,

},

logoContainer:{

width:64,

height:64,

backgroundColor:"#004225",

borderRadius:20,

justifyContent:"center",

alignItems:"center",

},

logo:{

fontSize:34,

},
sectionTitle:{

fontSize:22,

fontWeight:"800",

color:"#004225",

marginTop:30,

marginBottom:18,

},

quickGrid:{

flexDirection:"row",

flexWrap:"wrap",

justifyContent:"space-between",

},

});