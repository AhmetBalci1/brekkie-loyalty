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

      <Text style={styles.title}>
        BREKKIE YÖNETİCİ
      </Text>

      <Text style={styles.subtitle}>
        Business Overview ☕
      </Text>

      <View style={styles.statsRow}>

        <View style={styles.statCard}>
         <Text style={styles.statNumber}>
            {analytics?.users || 0}
        </Text>

          <Text style={styles.statLabel}>
            👥Kullanıcılar
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {analytics?.scans || 0}
          </Text>

          <Text style={styles.statLabel}>
            ☕Scans
          </Text>
        </View>

      </View>

      <View style={styles.statsRow}>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {analytics?.rewards || 0}
          </Text>

          <Text style={styles.statLabel}>
           🎁 Ödüller
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            ₺{analytics?.revenue || 0}
          </Text>

          <Text style={styles.statLabel}>
           💰 Hasılat
          </Text>
        </View>

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

  statCard: {
    width: "48%",

    backgroundColor: "#004225",

    borderRadius: 28,

    paddingVertical: 28,

    alignItems: "center",

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.2,

    shadowRadius: 12,

    elevation: 8,
  },

  statNumber: {
    color: "#d4af37",

    fontSize: 32,

    fontWeight: "900",

    marginBottom: 8,
  },

  statLabel: {
    color: "#fff4e3",

    fontSize: 15,

    fontWeight: "600",
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
});