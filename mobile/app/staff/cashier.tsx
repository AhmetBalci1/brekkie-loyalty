import { router } from "expo-router";
import { useState } from "react";
import { useLocalSearchParams }
from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  useEffect,
} from "react";

import AsyncStorage
from "@react-native-async-storage/async-storage";

export default function CashierScreen() {
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
  
const {
  customerName,
  coffeeCount,
  freeCoffee,
  loyaltyLevel,
} = useLocalSearchParams();


const [history] = useState([
  {
    id: 1,
    name: "Ahmet",
    action: "+1 Coffee ☕",
  },

  {
    id: 2,
    name: "Zeynep",
    action: "Reward Earned 🎉",
  },

  {
    id: 3,
    name: "Can",
    action: "+1 Coffee ☕",
  },
]);

if (!authorized) {

  return null;
}
    
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        CASHIER MODE ☕
      </Text>

      <Text style={styles.subtitle}>
        Müşteri QR kodunu okutun
      </Text>
      <View style={styles.statsRow}>

  <View style={styles.statCard}>
    <Text style={styles.statNumber}>
      42
    </Text>

    <Text style={styles.statLabel}>
      Scan
    </Text>
  </View>

  <View style={styles.statCard}>
    <Text style={styles.statNumber}>
      6
    </Text>

    <Text style={styles.statLabel}>
      Reward
    </Text>
  </View>

  <View style={styles.statCard}>
    <Text style={styles.statNumber}>
      18
    </Text>

    <Text style={styles.statLabel}>
      Customer
    </Text>
  </View>

</View>
      <View style={styles.liveCard}>
  <Text style={styles.liveTitle}>
    LIVE POS
  </Text>

  <View style={styles.historyCard}>

  <Text style={styles.historyTitle}>
    SON İŞLEMLER
  </Text>

  {history.map((item) => (

    <View
      key={item.id}
      style={styles.historyItem}
    >

      <Text style={styles.historyName}>
        {item.name}
      </Text>

      <Text style={styles.historyAction}>
        {item.action}
      </Text>

    </View>
  ))}

</View>

<Text style={styles.liveText}>

  {customerName
    ? `${customerName}

${loyaltyLevel}

☕ ${coffeeCount} kahve

🎁 ${freeCoffee} free coffee`
    : "Henüz okutma yapılmadı ☕"}

</Text>
</View>

      <TouchableOpacity
        style={styles.scanButton}
        onPress={() =>
            router.push({
                pathname: "/scanner",
                params: {
                cashierMode: "true",
        },
    } as any)
        }
      >
        <Text style={styles.scanButtonText}>
          QR Tara
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#004225",

    justifyContent: "center",
    alignItems: "center",

    padding: 24,
  },

  title: {
    color: "#fff4e3",

    fontSize: 34,
    fontWeight: "900",

    marginBottom: 10,

    letterSpacing: 2,
  },

  subtitle: {
    color: "#d4af37",

    fontSize: 18,

    marginBottom: 40,
  },

  scanButton: {
    backgroundColor: "#d4af37",

    width: "100%",

    paddingVertical: 20,

    borderRadius: 24,

    alignItems: "center",
  },

  scanButtonText: {
    color: "#2a1d17",

    fontSize: 22,
    fontWeight: "bold",
  },

  liveCard: {
  width: "100%",

  backgroundColor: "#0b5d38",

  borderRadius: 28,

  paddingVertical: 24,
  paddingHorizontal: 20,

  marginBottom: 30,

  borderWidth: 1,
  borderColor: "rgba(212,175,55,0.2)",
},

liveTitle: {
  color: "#d4af37",

  fontSize: 18,

  fontWeight: "900",

  marginBottom: 8,

  letterSpacing: 1,
},

liveText: {
  color: "#fff4e3",

  fontSize: 15,

  lineHeight: 22,
},

statsRow: {
  width: "100%",

  flexDirection: "row",

  justifyContent: "space-between",

  marginBottom: 24,
},

statCard: {
  flex: 1,

  backgroundColor: "#0b5d38",

  marginHorizontal: 4,

  borderRadius: 20,

  paddingVertical: 20,

  alignItems: "center",

  borderWidth: 1,

  borderColor:
    "rgba(212,175,55,0.2)",
},

statNumber: {
  color: "#d4af37",

  fontSize: 24,

  fontWeight: "900",

  marginBottom: 4,
},

statLabel: {
  color: "#fff4e3",

  fontSize: 13,

  fontWeight: "600",
},

historyCard: {
  width: "100%",

  backgroundColor: "#0b5d38",

  borderRadius: 28,

  paddingVertical: 22,
  paddingHorizontal: 20,

  marginBottom: 26,

  borderWidth: 1,

  borderColor:
    "rgba(212,175,55,0.2)",
},

historyTitle: {
  color: "#d4af37",

  fontSize: 18,

  fontWeight: "900",

  marginBottom: 18,

  letterSpacing: 1,
},

historyItem: {
  flexDirection: "row",

  justifyContent: "space-between",

  paddingVertical: 12,

  borderBottomWidth: 1,

  borderBottomColor:
    "rgba(255,255,255,0.08)",
},

historyName: {
  color: "#fff4e3",

  fontSize: 15,

  fontWeight: "700",
},

historyAction: {
  color: "#d4af37",

  fontSize: 14,

  fontWeight: "600",
},
});