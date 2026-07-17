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
import * as Notifications from "expo-notifications";
import { registerForPushNotifications } from "../../services/notificationService";
import "../../tasks/geofenceTask";
import {
  initializeLocation,
} from "../../services/locationService";
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


export default function HomeScreen() {

  const [user, setUser] =
    useState<any>(null);
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] =
  useState(true);

  const [refreshing,
setRefreshing] =
useState(false);
useEffect(() => {

  registerForPushNotifications();

  initializeLocation();

  loadCampaigns();

}, []);
 const loadCampaigns = async () => {
  try {
    const response = await fetch(
  "https://brekkie-api.onrender.com/campaigns/mobile"
);

    const data = await response.json();

    console.log("Campaigns:", data);

    setCampaigns(data);

  } catch (err) {
    console.log(err);
  }
};
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
    loadCampaigns;
      
    
  

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
      source={require("../../assets/images/brekkie-foto2.png")}
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
  source={require("../../assets/images/brekkie-foto1.png")}
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
        <Text style={styles.welcome}>
          Hoş geldin, {user.name} 
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
   Kasada bu QR kodu gösterin.
  Her kahvede puan kazanın ☕
</Text>

<View style={styles.campaignSection}>

  <Text style={styles.campaignTitle}>
    🎉 Güncel Kampanyalar
  </Text>

  {campaigns.length === 0 ? (

    <Text style={styles.emptyCampaign}>
      Şu anda aktif kampanya bulunmuyor.
    </Text>

  ) : (

    campaigns.map((campaign) => (

      <View
        key={campaign.id}
        style={styles.campaignCard}
      >

        <Text style={styles.campaignCardTitle}>
          {campaign.title}
        </Text>

        <Text style={styles.campaignDescription}>
          {campaign.description}
        </Text>

      </View>

    ))

  )}

</View>
        
  <View style={styles.rewardCard}>


  <Text style={styles.rewardTitle}>
    🎁 Hediyeniz
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

    backgroundColor:"#F8F5F0",
   
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
  backgroundColor:"rgba(248,245,240,0.72)",

  borderWidth: 1,
  borderColor: "rgba(203,221,204,0.82)",

    borderRadius: 35,

    paddingVertical: 32,
    paddingHorizontal: 24,

    alignItems: "center",
  },

 topCard: {
  width: "100%",

   backgroundColor:"rgba(248,245,240,0.72)",

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

   backgroundColor:"rgba(248,245,240,0.72)",

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
    color:"#CBDDCC",

    fontSize: 30,

    fontWeight: "900",

    letterSpacing: 4,
  },

  club: {

    marginTop: -2,
    color:"#F1B993",

    fontSize: 30,

    fontWeight: "900",

    letterSpacing: 8,
  },

  subtitle: {
    color:"#262626",

    fontSize: 32,

    marginBottom: 30,
  },

  welcome: {
    color:"#262626",

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
    color:"#262626",

    fontSize: 16,

    fontWeight: "bold",

    marginBottom: 6,
  },

  progressBarBackground: {
    width: "100%",

    height: 18,

    backgroundColor:"#E7DDD0",

    borderRadius: 20,

    overflow: "hidden",

    marginTop: 10,
  },

  progressBarFill: {
    height: "100%",

    backgroundColor:"#F1B993",

    borderRadius: 20,
  },

  progressText: {
    color:"#262626",

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
    color:"#666",

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

    backgroundColor:"#F1B993",

    paddingVertical: 12,

    borderRadius: 22,

    alignItems: "center",
  },

  buttonText: {
    color:"#262626",

    fontSize: 18,
    marginBottom:1,

    fontWeight: "bold",
  },

  cashierButton: {
    width: "100%",

    backgroundColor:"#EADBC8",

    paddingVertical: 12,
    marginTop: 2,
    borderRadius: 20,

    alignItems: "center",
  },

  cashierButtonText: {
    color:"#262626",

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

  backgroundColor:"#F1B993",

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
  color:"#262626",

  fontSize: 18,

  fontWeight: "900",

  marginBottom: 6,

  letterSpacing: 1,
},

rewardSubtitle: {
  color:"#4B4B4B",

  fontSize: 14,


  fontWeight: "600",
},

useRewardButton: {
  marginTop: 14,

  backgroundColor:"#D8C3A8",

  paddingVertical: 14,

  borderRadius: 18,

  alignItems: "center",
},

rewardTitle: {
  color:"#262626",

  fontSize: 18,

  fontWeight: "800",
},

rewardUsedPopup: {
  width: "100%",

  backgroundColor:"#F6E8D5",

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
  color:"#262626",

  fontSize: 20,

  fontWeight: "900",

  marginBottom: 6,
},

rewardUsedText: {
  color:"#C97C4A",

  fontSize: 14,

  fontWeight: "600",
},
adminButton: {
  width: "100%",

  backgroundColor:"#D8C3A8",
  marginBottom: 2,
  paddingVertical: 12,

  borderRadius: 12,

  alignItems: "center",
},

adminButtonText: {
  color:"#262626",

  fontSize: 16,

  fontWeight: "bold",
},

 staffButton: {

  width: "100%",

  color:"#1F1F1F",

  padding: 16,

  borderRadius: 18,

  alignItems: "center",
  

  

  borderWidth: 1,

  borderColor: "#1F1F1F",
},

staffButtonText: {

  color:"#262626",

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
  backgroundColor:"rgba(255,255,255,0.55)",
  borderRadius: 20,
  paddingVertical: 18,
  alignItems: "center",
},

smallNumber: {
  color:"#F1B993",
  fontSize: 28,
  fontWeight: "900",
},

smallLabel: {
  color:"#262626",
  fontSize: 14,
  fontWeight: "600",
},
totalCoffeeText: {
  color:"#262626",
  fontSize: 16,
  fontWeight: "700",
  marginTop: 12,
  marginBottom: 10,
},
qrInfo: {
  color:"#444",
  textAlign: "center",
  marginTop: 12,
  marginBottom: 20,
  fontSize: 14,
  lineHeight: 22,
},
campaignSection: {
  width: "100%",
  marginBottom: 22,
},

campaignTitle: {
  color:"#262626",
  fontSize: 20,
  fontWeight: "800",
  marginBottom: 14,
},

campaignCard: {
  backgroundColor:"rgba(255,255,255,0.60)",
  borderRadius: 20,
  padding: 16,
  marginBottom: 12,
  borderWidth: 1,
  borderColor:"rgba(241,185,147,0.35)",
},

campaignCardTitle: {
  color:"#262626",
  fontSize: 18,
  fontWeight: "700",
},

campaignDescription: {
  color:"#555",
  marginTop: 6,
  lineHeight: 20,
},

emptyCampaign: {
  color:"#262626",
  opacity: 0.7,
},
});