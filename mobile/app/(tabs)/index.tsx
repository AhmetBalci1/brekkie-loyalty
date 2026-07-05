import {
  useEffect,
  useState,
  useCallback,
} from "react";
import { useFocusEffect }
from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  RefreshControl,
} from "react-native";
import * as Device from "expo-device";

import * as Notifications from "expo-notifications";

import Constants from "expo-constants";

import AsyncStorage from "@react-native-async-storage/async-storage";

import QRCode from "react-native-qrcode-svg";

import { router } from "expo-router";
Notifications.setNotificationHandler({

  handleNotification: async () => ({

    shouldShowBanner: true,

    shouldShowList: true,

    shouldPlaySound: true,

    shouldSetBadge: false,

  }),

});
async function registerForPushNotificationsAsync() {

  if (!Device.isDevice) {

    alert("Gerçek bir cihaz kullanmalısın.");

    return null;

  }

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {

    const { status } =
      await Notifications.requestPermissionsAsync();

    finalStatus = status;

  }

  if (finalStatus !== "granted") {

    alert("Bildirim izni verilmedi.");

    return null;

  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId;

  const token =
    await Notifications.getExpoPushTokenAsync({

      projectId,

    });

  console.log("Push Token:", token.data);
  const savedUser =
  await AsyncStorage.getItem("user");

if (savedUser) {

  const user =
    JSON.parse(savedUser);

  await fetch(
    "https://brekkie-api.onrender.com/users/push-token",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({

        userId: user.id,

        pushToken: token.data,

      }),

    }
  );

  console.log(
    "✅ Push Token kaydedildi."
  );

}

  return token.data;

}

export default function HomeScreen() {

  const [user, setUser] =
    useState<any>(null);
    const [loading, setLoading] =
  useState(true);

  const [refreshing,
setRefreshing] =
useState(false);
useEffect(() => {

  registerForPushNotificationsAsync();

}, []);
const loadUser = async () => {
  

  try {

    const savedUser =
      await AsyncStorage.getItem(
        "user"
      );

    if (!savedUser) return;

    const parsedUser =
      JSON.parse(savedUser);

    if (!parsedUser?.id) {

      setUser(null);

      return;
    }

    const response =
      await fetch(
        
        `https://brekkie-api.onrender.com/users/${parsedUser.id}`
        
      );
      console.log(parsedUser);

    const freshUser =
      await response.json();

    if (freshUser.error) {

      console.log(
        freshUser.error
      );

      return;
    }

    setUser(freshUser);

    await AsyncStorage.setItem(
      "user",
      JSON.stringify(freshUser)
    );

  } catch (error) {

    console.log(error);
  }
  setLoading(false);
};

  useFocusEffect(
  useCallback(() => {

    loadUser();
      
    
  

  }, [])
);
  const onRefresh =
       async () => {

  setRefreshing(true);

  await loadUser();

  setRefreshing(false);
};
  const [rewardUsedVisible,
  setRewardUsedVisible] =
  useState(false);

  if (!user) {
  return (
    <ImageBackground
      source={require("../../assets/images/brekkie-foto2.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>

        <View style={styles.authContainer}>
          <View style={styles.authCard}>
          <Image
  source={require("../../assets/images/brekkie-logo.png")}
  style={styles.logo}
/>
          <Text style={styles.title}>
            BREKKIE
          </Text>

          <Text style={styles.club}>
            CLUB
          </Text>

          <Text style={styles.subtitle}>
            Hoşgeldiniz
          </Text>

   <View style={styles.buttonContainer}>

  <TouchableOpacity
    style={styles.button}
    onPress={() =>
      router.push(
        "/login" as any
      )
    }
  >
    <Text style={styles.buttonText}>
      Giriş Yap
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.cashierButton}
    onPress={() =>
      router.push(
        "/register" as any
      )
    }
  >
    <Text
      style={
        styles.cashierButtonText
      }
    >
      Kayıt Ol
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.staffButton}
    onPress={() =>
      router.push(
        "/staff-login" as any
      )
    }
  >
    <Text
      style={
        styles.staffButtonText
      }
    >
      Çalışan Girişi 🧾
    </Text>
  </TouchableOpacity>

</View>
               </View>
        </View>

      </View>
    </ImageBackground>
  );
  }

  const totalCoffee =
  (user?.coffee_count || 0) +
  (user?.free_coffee || 0) * 10;

  let loyaltyLevel = "Bronze ☕";
  let loyaltyColor = "#cd7f32";

  if (totalCoffee >= 10) {
    loyaltyLevel = "Silver ✨";
    loyaltyColor = "#c0c0c0";
  }

  if (totalCoffee >= 25) {
    loyaltyLevel = "Gold 👑";
    loyaltyColor = "#d4af37";
  }

  if (totalCoffee >= 50) {
    loyaltyLevel = "Emerald 💎";
    loyaltyColor = "#50c878";
  }

  if (loading) {

  return null;
}
  return (

  <ImageBackground
  source={require("../../assets/images/brekkie-foto1.jpg")}
  style={styles.background}
  resizeMode="cover"
>

<View style={styles.overlay}>

  <ScrollView
    contentContainerStyle={{
      padding: 20,
      paddingBottom: 40,
      alignItems: "center",
    }}
    showsVerticalScrollIndicator={false}
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        tintColor="#d4af37" 
        />
    }
  >
   
  
      <View style={styles.topCard}>
        <Image
  source={require("../../assets/images/brekkie-logo.png")}
  style={styles.logo}
/>
<View style={styles.titleWrapper}>

  <Text style={styles.titleShadow}>
    BREKKIE
  </Text>

  <Text style={styles.title}>
    BREKKIE
  </Text>

  <Text style={styles.clubShadow}>
    CLUB
  </Text>

  <Text style={styles.club}>
    CLUB
  </Text>

</View>
 

        <Text style={styles.welcome}>
          Hoş geldin, {user.name} ☕
        </Text>
         <Text style={styles.totalCoffeeText}>
      ☕ Toplam Kahve:
      {user.coffee_count +
       user.free_coffee * 10}
</Text>
        <View
          style={[
            styles.levelBadge,
            {
              backgroundColor:
                loyaltyColor,
            },
          ]}
          
        >

          <Text style={styles.levelText}>
            {loyaltyLevel}
          </Text>
        </View>

        <View style={styles.statsRow}>

  <View style={styles.smallStat}>
    <Text style={styles.smallNumber}>
      {user.coffee_count}
    </Text>

    <Text style={styles.smallLabel}>
      ☕ Kahve
    </Text>
  </View>

  <View style={styles.smallStat}>
    <Text style={styles.smallNumber}>
      {user.free_coffee}
    </Text>

    <Text style={styles.smallLabel}>
      🎁 Ödül
    </Text>
  </View>

</View>

        <View
          style={
            styles.progressBarBackground
          }
        >
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${
                  user.coffee_count * 10
                }%`,
              },
            ]}
          />
        </View>

        <Text style={styles.progressText}>
          {user.coffee_count} / 10
          Kahve
        </Text>
        </View>

        <View style={styles.bottomCard}>
        <View style={styles.qrContainer}>
         {user?.qr_code && (

  <QRCode
    value={user.qr_code}
    size={180}
  />

)}
        </View>

       <Text style={styles.qrCodeText}>
      Üyelik QR Kodunuz
     </Text>
     <Text style={styles.qrInfo}>
  📱 Kasada bu QR kodu gösterin.
  Her kahvede puan kazanın ☕
</Text>


        
  <View style={styles.rewardCard}>


  <Text style={styles.rewardTitle}>
    🎁 Reward Balance
  </Text>


  {rewardUsedVisible && (

  <View style={styles.rewardUsedPopup}>

    <Text style={styles.rewardUsedEmoji}>
      ☕
    </Text>

    <Text style={styles.rewardUsedTitle}>
      Ödül Kullanıldı
    </Text>

    <Text style={styles.rewardUsedText}>
      Ücretsiz kahve başarıyla
      kullanıldı
    </Text>

  </View>
)}

    <Text style={styles.rewardSubtitle}>
      {user.free_coffee} adet ücretsiz
      kahveniz hazır.
    </Text>
  
  </View>
        <View
          style={styles.buttonContainer}
        >
          
    
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={async () => {
              await AsyncStorage.removeItem(
                "user"
              );
              await AsyncStorage.removeItem(
  "staff"
);

              setUser(null);

              router.replace(
                "/" as any
              );
            }}
          >
            <Text
              style={
                styles.logoutButtonText
              }
            >
              Çıkış Yap
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
      

</View>

</ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#e9dfcf",
   
    padding: 20,
  },

  authContainer: {
    flex: 1,

  

    justifyContent: "center",
    alignItems: "center",

    padding: 20,
  },

  authCard: {
     width: "100%",
  backgroundColor: "rgba(0,66,37,0.82)",

  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.15)",

    borderRadius: 35,

    paddingVertical: 32,
    paddingHorizontal: 24,

    alignItems: "center",
  },

 topCard: {
  width: "100%",

   backgroundColor: "rgba(0,66,37,0.85)",

  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.15)",

  borderRadius: 35,

  paddingVertical: 22,
  paddingHorizontal: 20,

  alignItems: "center",

  marginBottom: 18,

  shadowColor: "#000",

  shadowOffset: {
    width: 0,
    height: 10,
  },

  shadowOpacity: 0.2,

  shadowRadius: 20,

  elevation: 10,
},

bottomCard: {
  width: "100%",

   backgroundColor: "rgba(0,66,37,0.85)",

  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.15)",

  borderRadius: 35,

  paddingVertical: 22,
  paddingHorizontal: 20,

  alignItems: "center",

  shadowColor: "#000",

  shadowOffset: {
    width: 0,
    height: 10,
  },

  shadowOpacity: 0.2,

  shadowRadius: 20,

  elevation: 10,
},

  title: {
    color: "#fff4e3",

    fontSize: 30,

    fontWeight: "900",

    letterSpacing: 4,
  },

  club: {

    marginTop: -2,
    color: "#d4af37",

    fontSize: 14,

    fontWeight: "900",

    letterSpacing: 8,
  },

  subtitle: {
    color: "#d4af37",

    fontSize: 32,

    marginBottom: 30,
  },

  welcome: {
    color: "#fff4e3",

    fontSize: 18,

    marginBottom: 12,
  },

  levelBadge: {
    paddingHorizontal: 18,
    paddingVertical: 8,

    borderRadius: 20,

    marginBottom: 20,
  },

  levelText: {
    color: "white",

    fontWeight: "bold",

    fontSize: 14,

    letterSpacing: 1,
  },

  coffeeText: {
    color: "#fff4e3",

    fontSize: 16,

    fontWeight: "bold",

    marginBottom: 6,
  },

  progressBarBackground: {
    width: "100%",

    height: 18,

    backgroundColor: "#d7d0c5",

    borderRadius: 20,

    overflow: "hidden",

    marginTop: 10,
  },

  progressBarFill: {
    height: "100%",

    backgroundColor: "#d4af37",

    borderRadius: 20,
  },

  progressText: {
    color: "#fff4e3",

    marginTop: 10,
    marginBottom: 18,

    fontSize: 15,

    fontWeight: "600",
  },

  qrContainer: {
    backgroundColor: "white",

    padding: 14,

    borderRadius: 24,

    marginTop: 10,
  },

  qrCodeText: {
    color: "#fff4e3",

    marginTop: 12,
    marginBottom: 4,

    fontSize: 14,

    letterSpacing: 2,

    opacity: 0.8,
  },



  buttonContainer: {
    width: "100%",
    marginTop: 12,
    gap: 14,
  },

  button: {
    width: "100%",

    backgroundColor: "#d4af37",

    paddingVertical: 12,

    borderRadius: 22,

    alignItems: "center",
  },

  buttonText: {
    color: "#2a1d17",

    fontSize: 18,
    marginBottom:1,

    fontWeight: "bold",
  },

  cashierButton: {
    width: "100%",

    backgroundColor: "#0b5d38",

    paddingVertical: 12,
    marginTop: 2,
    borderRadius: 20,

    alignItems: "center",
  },

  cashierButtonText: {
    color: "#fff4e3",

    fontSize: 17,
    marginBottom:3,

    fontWeight: "bold",
  },

  logoutButton: {
    width: "100%",

    backgroundColor: "#7a1f1f",

    paddingVertical: 12,

    borderRadius: 22,

    alignItems: "center",
  },

  logoutButtonText: {
    color: "#fff4e3",

    fontSize: 17,

    fontWeight: "bold",
  },

logo: {
  width: 150,
  height: 150,

  borderRadius: 75,

  marginBottom: 22,

  shadowColor: "#000",

  shadowOffset: {
    width: 0,
    height: 8,
  },

  shadowOpacity: 0.25,

  shadowRadius: 12,

  elevation: 10,
},
titleWrapper: {
  position: "relative",

  marginBottom: 18,

  alignItems: "center",
},

titleShadow: {
  position: "absolute",

  top: 4,
  left: 3,

  color: "#002814",

  fontSize: 30,

  fontWeight: "900",

  letterSpacing: 4,
},

clubShadow: {
  position: "absolute",

  top: 38,

  alignSelf: "center",

  color: "#002814",

  fontSize: 14,

  fontWeight: "900",

  letterSpacing: 8,
},

rewardCard: {
  width: "100%",

  backgroundColor: "#d4af37",

  borderRadius: 24,

  paddingVertical: 20,
  paddingHorizontal: 20,

  marginBottom: 1,

  shadowColor: "#d4af37",

  shadowOffset: {
    width: 0,
    height: 8,
  },

  shadowOpacity: 0.4,

  shadowRadius: 12,

  elevation: 10,
},

rewardCardTitle: {
  color: "#2a1d17",

  fontSize: 18,

  fontWeight: "900",

  marginBottom: 6,

  letterSpacing: 1,
},

rewardSubtitle: {
  color: "#2a1d17",

  fontSize: 14,


  fontWeight: "600",
},

useRewardButton: {
  marginTop: 14,

  backgroundColor: "#2a1d17",

  paddingVertical: 14,

  borderRadius: 18,

  alignItems: "center",
},

rewardTitle: {
  color: "#fff4e3",

  fontSize: 18,

  fontWeight: "800",
},

rewardUsedPopup: {
  width: "100%",

  backgroundColor: "#0b5d38",

  borderRadius: 24,

  paddingVertical: 20,
  paddingHorizontal: 20,

  marginBottom: 20,

  alignItems: "center",

  borderWidth: 1,

  borderColor:
    "rgba(212,175,55,0.2)",
},

rewardUsedEmoji: {
  fontSize: 42,

  marginBottom: 8,
},

rewardUsedTitle: {
  color: "#fff4e3",

  fontSize: 20,

  fontWeight: "900",

  marginBottom: 6,
},

rewardUsedText: {
  color: "#d4af37",

  fontSize: 14,

  fontWeight: "600",
},
adminButton: {
  width: "100%",

  backgroundColor: "#2a1d17",
  marginBottom: 2,
  paddingVertical: 12,

  borderRadius: 12,

  alignItems: "center",
},

adminButtonText: {
  color: "#fff4e3",

  fontSize: 16,

  fontWeight: "bold",
},

 staffButton: {

  width: "100%",

  backgroundColor: "#2d2d2d",

  padding: 16,

  borderRadius: 18,

  alignItems: "center",
  

  

  borderWidth: 1,

  borderColor: "#c59d5f",
},

staffButtonText: {

  color: "#c59d5f",

  fontSize: 16,

  fontWeight: "700",
},
background: {
  flex: 1,
},

overlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.30)",
},
statsRow: {
  width: "100%",
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 15,
},

smallStat: {
  width: "48%",
  backgroundColor: "rgba(255,255,255,0.10)",
  borderRadius: 20,
  paddingVertical: 18,
  alignItems: "center",
},

smallNumber: {
  color: "#d4af37",
  fontSize: 28,
  fontWeight: "900",
},

smallLabel: {
  color: "#fff4e3",
  fontSize: 14,
  fontWeight: "600",
},
totalCoffeeText: {
  color: "#d4af37",
  fontSize: 16,
  fontWeight: "700",
  marginTop: 12,
  marginBottom: 10,
},
qrInfo: {
  color: "#fff4e3",
  textAlign: "center",
  marginTop: 12,
  marginBottom: 20,
  fontSize: 14,
  lineHeight: 22,
},
});