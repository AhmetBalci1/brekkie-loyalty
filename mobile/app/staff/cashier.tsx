import { router } from "expo-router";
import { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import HeaderCard
from "../components/cashier/HeaderCard";
import ScanCard from "../components/cashier/ScanCard";
import CustomerCard
from "../components/cashier/CustomerCard";
import HistoryCard from "../components/cashier/HistoryCard";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

import AsyncStorage
from "@react-native-async-storage/async-storage";

export default function CashierScreen() {
const [staffName, setStaffName] =
  useState("");

const [staffRole, setStaffRole] =
  useState("");
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
        const name =
  await AsyncStorage.getItem(
    "staffName"
  );

const role =
  await AsyncStorage.getItem(
    "staffRole"
  );

setStaffName(name || "");

setStaffRole(role || "");

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
    userId,
    customerName,
    coffeeCount,
    freeCoffee,
    loyaltyLevel,
  } = useLocalSearchParams();
  const [currentCustomer, setCurrentCustomer] = useState({
  userId: Number(userId || 0),
  name: String(customerName || ""),
  coffeeCount: Number(coffeeCount || 0),
  freeCoffee: Number(freeCoffee || 0),
  loyaltyLevel: String(loyaltyLevel || "Standart"),
});
const useReward = async () => {
  try {
    const response = await fetch(
      "https://brekkie-api.onrender.com/use-reward",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentCustomer.userId,
        }),
      }
    );

    const result = await response.json();

    if (result.success) {
      Alert.alert(
        "Başarılı",
        "Ücretsiz kahve kullanıldı ☕"
      );

      const user = result.user;

      const totalCoffee =
        user.coffee_count +
        user.free_coffee * 10;

      let loyaltyLevel = "Bronze ☕";

      if (totalCoffee >= 10)
        loyaltyLevel = "Silver ✨";

      if (totalCoffee >= 25)
        loyaltyLevel = "Gold 👑";

      if (totalCoffee >= 50)
        loyaltyLevel = "Emerald 💎";

      setCurrentCustomer({
        userId: user.id,
        name: user.name,
        coffeeCount: user.coffee_count,
        freeCoffee: user.free_coffee,
        loyaltyLevel,
      });

      await loadHistory();


    } else {

      Alert.alert(
        "Hata",
        result.error || "İşlem başarısız."
      );

    }

  } catch (err) {
    console.log(err);
  }
};

  const [history,setHistory] = useState<any[]>([]);
const loadHistory = async () => {
  
  try {

    const response =
      await fetch(
        "https://brekkie-api.onrender.com/recent-scans"
      );

    const data =
      await response.json();

    setHistory(data);

  } catch (err) {

    console.log(err);

  }

};
const addCoffee = async () => {
  try {
    const response = await fetch(
      "https://brekkie-api.onrender.com/scan",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentCustomer.userId,
        }),
      }
    );

    const result = await response.json();
    console.log("SCAN RESULT:", result);
console.log("CURRENT USER:", currentCustomer);

    if (result.success) {

      Alert.alert(
        "Başarılı",
        "Kahve başarıyla eklendi ☕"
      );

      const user = result.user;

      const totalCoffee =
        user.coffee_count +
        user.free_coffee * 10;

      let loyaltyLevel = "Bronze ☕";

      if (totalCoffee >= 10)
        loyaltyLevel = "Silver ✨";

      if (totalCoffee >= 25)
        loyaltyLevel = "Gold 👑";

      if (totalCoffee >= 50)
        loyaltyLevel = "Emerald 💎";

      setCurrentCustomer({
        userId: user.id,
        name: user.name,
        coffeeCount: user.coffee_count,
        freeCoffee: user.free_coffee,
        loyaltyLevel,
      });

      await loadHistory();

    } else {

      Alert.alert(
        "Hata",
        result.error || "Kahve eklenemedi."
      );

    }

  } catch (err) {

    console.log(err);

    Alert.alert(
      "Hata",
      "Sunucuya ulaşılamadı."
    );

  }
};
  useEffect(() => {

  loadHistory();

}, []);

  if (!authorized) {

    return null;
  }

  return (

    <ScrollView 
      style={styles.container}
      contentContainerStyle={{
        alignItems: "center",
        paddingBottom: 40,
      }}
      showsVerticalScrollIndicator={false}
      >

  <HeaderCard
  staffName={staffName}
  staffRole={staffRole}
/>

      <Text style={styles.subtitle}>
        Müşteri QR kodunu okutun
      </Text>

 <ScanCard
  onPress={() =>
    router.push({
      pathname: "/scanner",
      params: {
        cashierMode: "true",
      },
    })
  }
/>
<CustomerCard
  name={currentCustomer.name}
  coffeeCount={currentCustomer.coffeeCount}
  freeCoffee={currentCustomer.freeCoffee}
  membership={currentCustomer.loyaltyLevel}
  onAddCoffee={addCoffee}
  onUseReward={useReward}
/>

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

    backgroundColor: "#004225",


    padding: 24,
    
  },

  title: {
    color: "#fff4e3",

    fontSize: 34,
    fontWeight: "900",

    marginTop: 20,

    letterSpacing: 2,
  },

  subtitle: {
    color: "#d4af37",

    fontSize: 18,

    marginBottom: 2,
  },
  scanButton: {
  width: "100%",
  backgroundColor: "#d4af37",
  paddingVertical: 32,
  borderRadius: 26,
  alignItems: "center",
  marginVertical: 18,

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 6,
  },
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 8,
},

scanButtonText: {
  color: "#2a1d17",
  fontSize: 28,
  fontWeight: "900",
  letterSpacing: 1,
},
  logoutButton: {
  width: "100%",
  marginBottom: 5,

  paddingVertical: 16,

  borderRadius: 20,

  backgroundColor: "#7a1f1f",

  alignItems: "center",
},

logoutText: {
  color: "#fff",

  fontWeight: "800",

  fontSize: 16,
},
staffName: {
  color: "#fff4e3",
  fontSize: 18,
  fontWeight: "700",
  marginTop: 8,
},

staffRole: {
  color: "#d4af37",
  fontSize: 15,
  marginBottom: 16,
},
});