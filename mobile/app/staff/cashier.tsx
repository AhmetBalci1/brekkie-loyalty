import { router } from "expo-router";
import { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

import AsyncStorage
from "@react-native-async-storage/async-storage";

export default function CashierScreen() {

  const [authorized,
    setAuthorized] =
    useState(false);

  const [rewardUsed,
    setRewardUsed] =
    useState(false);

  const [analytics, setAnalytics] = useState<any>(null);

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
  

    const fetchAnalytics = async () => {
      try {
        const response = 
          await fetch(
            "https://brekkie-api.onrender.com/analytics"
          );
        const data = 
          await response.json();
        
        setAnalytics(data);
      
      } catch (error) {
        console.log(error);
      }
    };

    fetchAnalytics();

  }, []);

  const {
    userId,
    customerName,
    coffeeCount,
    freeCoffee,
    loyaltyLevel,
  } = useLocalSearchParams();

  const [history,setHistory] = useState<any[]>([]);

  useEffect(() => {

  fetch(
    "https://brekkie-api.onrender.com/recent-scans"
  )
    .then((res) => res.json())
    .then((data) => {

      setHistory(data);

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
        alignItems: "center",
        paddingBottom: 40,
      }}
      showsVerticalScrollIndicator={false}
      >

      <Text style={styles.title}>
        BREKKIE POS ☕
      </Text>

      <Text style={styles.subtitle}>
        Müşteri QR kodunu okutun
      </Text>

      <View style={styles.statsRow}>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {analytics?.scans || 0}
          </Text>

          <Text style={styles.statLabel}>
           ☕ Scans
          </Text>
        </View>

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
            {analytics?.users || 0}
          </Text>

          <Text style={styles.statLabel}>
            👥 Müşteriler
          </Text>
        </View>

      </View>

      <View style={styles.liveCard}>

        <Text style={styles.liveTitle}>
          SON MÜŞTERİ☕
        </Text>

{customerName ? (
  <>

 <Text style={styles.customerName}>
  {customerName}
</Text>

<Text style={styles.customerLevel}>
  👑 {loyaltyLevel}
</Text>

<View style={styles.customerStatsRow}>

  <View style={styles.customerStatCard}>
    <Text style={styles.customerStatNumber}>
      {coffeeCount}
    </Text>

    <Text style={styles.customerStatLabel}>
      ☕ Kahve
    </Text>
  </View>

  <View style={styles.customerStatCard}>
    <Text style={styles.customerStatNumber}>
      {freeCoffee}
    </Text>

    <Text style={styles.customerStatLabel}>
      🎁 Ödül
    </Text>
  </View>

</View>

  </>
) : (

  <Text style={styles.liveText}>
    Henüz okutma yapılmadı ☕
  </Text>

)}

        

      </View>
          <View style={styles.historyCard}>

  <Text style={styles.historyTitle}>
    SON İŞLEMLER
  </Text>

  <ScrollView
    style={{ maxHeight: 180 }}
    showsVerticalScrollIndicator={false}
    nestedScrollEnabled={true}
  >

    {history.map((item: any) => (

      <View
        key={item.id}
        style={styles.historyItem}
      >

        <Text style={styles.historyName}>
          {item.name}
        </Text>

        <Text style={styles.historyAction}>
          {item.reward_earned
            ? "Reward Kullanıldı 🎁"
            : "+1 Coffee ☕"}
        </Text>

      </View>

    ))}

  </ScrollView>

</View>

      {Number(freeCoffee) > 0 &&
        !rewardUsed && (

        <TouchableOpacity

          style={styles.rewardButton}

          onPress={async () => {

            try {

              const response =
                await fetch(
                  "https://brekkie-api.onrender.com/use-reward",
                  {
                    method: "POST",

                    headers: {
                      "Content-Type":
                        "application/json",
                    },

                    body: JSON.stringify({
                      userId:
                        Number(userId),
                    }),
                  }
                );

              const result =
                await response.json();

              console.log(result);

              setRewardUsed(true);

            } catch (error) {

              console.log(error);
            }
          }}
        >

          <Text
            style={styles.rewardButtonText}
          >
            ÜCRETSİZ KAHVE KULLAN ☕
          </Text>

        </TouchableOpacity>
      )}

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

  statsRow: {
    width: "100%",

    flexDirection: "row",

    justifyContent: "space-between",

    marginBottom: 5,
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

    fontSize: 20,

    fontWeight: "900",

    marginBottom: 1,
  },

  statLabel: {
    color: "#fff4e3",

    fontSize: 12,

    fontWeight: "600",
  },

  liveCard: {
    width: "100%",
    minHeight: 220,
    backgroundColor: "#0b5d38",

    borderRadius: 28,

    paddingVertical: 24,
    paddingHorizontal: 20,

    marginBottom: 7,

    borderWidth: 1,

    borderColor:
      "rgba(212,175,55,0.2)",
  },

  liveTitle: {
    color: "#d4af37",

    fontSize: 18,

    fontWeight: "900",

    marginBottom: 7,

    letterSpacing: 1,
  },

  liveText: {
    color: "#fff4e3",

    fontSize: 15,

    lineHeight: 18,
  },
  customerName: {
  color: "#fff4e3",

  fontSize: 28,

  fontWeight: "900",

  marginBottom: 8,
},

customerLevel: {
  color: "#d4af37",

  fontSize: 18,

  fontWeight: "700",

  marginBottom: 20,
},

customerInfo: {
  color: "#fff4e3",

  fontSize: 16,

  marginBottom: 8,
},

  historyCard: {
    width: "100%",

    backgroundColor: "#0b5d38",

    borderRadius: 28,

    paddingVertical: 22,
    paddingHorizontal: 20,

    marginBottom: 2,
    
    maxHeight: 260,

    borderWidth: 1,

    borderColor:
      "rgba(212,175,55,0.2)",
  },

  historyTitle: {
    color: "#d4af37",

    fontSize: 18,

    fontWeight: "900",

    marginBottom: 1,

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

  rewardButton: {

    backgroundColor: "#d4af37",

    width: "100%",

    paddingVertical: 16,

    borderRadius: 20,

    alignItems: "center",

    marginBottom: 5,
  },

  rewardButtonText: {

    color: "#2a1d17",

    fontSize: 16,

    fontWeight: "900",
  },

  scanButton: {
    fontSize: 30,

    backgroundColor: "#d4af37",

    width: "100%",

    paddingVertical: 24,

    borderRadius: 30,

    alignItems: "center",
    marginBottom: 9,
  },

  scanButtonText: {

    color: "#2a1d17",

    fontSize: 26,

    fontWeight: "900",
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
customerStatsRow: {
  flexDirection: "row",

  justifyContent: "space-between",

  marginTop: 12,
},

customerStatCard: {
  flex: 1,

  backgroundColor: "rgba(212,175,55,0.18)",

  paddingVertical: 16,

  borderRadius: 16,

  alignItems: "center",

  marginHorizontal: 4,
},

customerStatNumber: {
  color: "#d4af37",

  fontSize: 26,

  fontWeight: "900",
},

customerStatLabel: {
  color: "#fff4e3",

  fontSize: 13,

  marginTop: 4,
},
});