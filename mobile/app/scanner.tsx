import {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";

import {
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useLocalSearchParams }
from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { router } from "expo-router";

export default function ScannerScreen() {
  const { cashierMode } =
  useLocalSearchParams();

  const [permission, requestPermission] =
    useCameraPermissions();

  const [scanned, setScanned] =
    useState(false);
  const scanLineAnimation =
    useState(
      new Animated.Value(0)
    )[0];

  useEffect(() => {

    if (!permission?.granted) {
      requestPermission();
    }

    Animated.loop(
      Animated.timing(
        scanLineAnimation,
        {
          toValue: 180,

          duration: 1800,

          easing: Easing.linear,

          useNativeDriver: true,
        }
      )
    ).start();

  }, []);

  const handleBarcodeScanned =
    async ({ data }: any) => {
      console.log("QR DETECTED");

   if (scanned) {

  return;
}

setScanned(true);

const scannedCode = data;

if (!scannedCode) {

  setScanned(false);

  return;
}

    try {

     
        console.log(
  "SCANNED:",
  scannedCode
);
console.log("FETCH START");
const staffId =
  await AsyncStorage.getItem("staffId");

const staffName =
  await AsyncStorage.getItem("staffName");      
const response =

      
        await fetch(
  "https://brekkie-api.onrender.com/customer-by-qr",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

          body: JSON.stringify({
  qr_code: data,
  staffId,
  staffName,
}),
          }
        );
        console.log("FETCH END");

      const result = await response.json();

console.log("RESULT:", result);

      if (result.error) {

        console.log(
          result.error
        );

        setScanned(false);

        return;
      }

   const user = result.user;

const updatedUser = {
  id: user.id,
  name: user.name,
  email: user.email,
  qr_code: user.qr_code,
  coffee_count: user.coffee_count,
  free_coffee: user.free_coffee,
};

if (cashierMode !== "true") {
  await AsyncStorage.setItem(
    "user",
    JSON.stringify(updatedUser)
  );
}

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
  if (cashierMode === "true") {

  router.replace({
    pathname: "/staff/cashier",
    params: {
      userId: user.id,
      customerName: user.name,
      coffeeCount: user.coffee_count,
      freeCoffee: user.free_coffee,
      loyaltyLevel,
    },
  } as any);

} else {

  router.replace("/(tabs)" as any);

}

    } catch (error) {

      console.log(error);

      setScanned(false);
    }
  };

  return (

    <View style={styles.container}>

      <CameraView
        style={
          StyleSheet.absoluteFillObject
        }
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
          
        }}    
        onBarcodeScanned={
  scanned
    ? undefined
    : handleBarcodeScanned
}
      />

      <View style={styles.overlay}>

        <Text style={styles.scanText}>
          QR Kodunu Taratınız ☕
        </Text>

      </View>

      <View style={styles.scanContainer}>

        <View style={styles.scanFrame}>

          <View
            style={
              styles.cornerTopLeft
            }
          />

          <View
            style={
              styles.cornerTopRight
            }
          />

          <View
            style={
              styles.cornerBottomLeft
            }
          />

          <View
            style={
              styles.cornerBottomRight
            }
          />

          <Animated.View
            style={[
              styles.scanLine,
              {
                transform: [
                  {
                    translateY:
                      scanLineAnimation,
                  },
                ],
              },
            ]}
          />

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  overlay: {
    position: "absolute",
    top: 80,
    width: "100%",
    alignItems: "center",
  },

  scanText: {
    color: "#262626",

    fontSize: 20,
    fontWeight: "bold",

    backgroundColor: "#E8B07A",

    paddingHorizontal: 24,
    paddingVertical: 14,

    borderRadius: 22,

    letterSpacing: 1,
  },

  scanContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  scanFrame: {
    width: 280,
    height: 280,

    position: "relative",

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "rgba(255,255,255,0.04)",

    borderRadius: 30,

    borderWidth: 1.5,
    borderColor: "rgba(232,176,122,0.20)",
  },

  cornerTopLeft: {
    position: "absolute",

    top: 0,
    left: 0,

    width: 50,
    height: 50,

    borderTopWidth: 6,
    borderLeftWidth: 6,

    borderColor: "#E8B07A",

    borderTopLeftRadius: 22,

    shadowColor: "#E8B07A",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },

  cornerTopRight: {
    position: "absolute",

    top: 0,
    right: 0,

    width: 50,
    height: 50,

    borderTopWidth: 6,
    borderRightWidth: 6,

    borderColor: "#E8B07A",

    borderTopRightRadius: 22,

    shadowColor: "#E8B07A",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },

  cornerBottomLeft: {
    position: "absolute",

    bottom: 0,
    left: 0,

    width: 50,
    height: 50,

    borderBottomWidth: 6,
    borderLeftWidth: 6,

    borderColor: "#E8B07A",

    borderBottomLeftRadius: 22,

    shadowColor: "#E8B07A",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },

  cornerBottomRight: {
    position: "absolute",

    bottom: 0,
    right: 0,

    width: 50,
    height: 50,

    borderBottomWidth: 6,
    borderRightWidth: 6,

    borderColor: "#E8B07A",

    borderBottomRightRadius: 22,

    shadowColor: "#E8B07A",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },

  scanLine: {
    position: "absolute",

    width: 220,
    height: 3,

    backgroundColor: "#E8B07A",

    borderRadius: 10,

    shadowColor: "#E8B07A",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 10,

    top: 50,
  },

  successPopup: {
    position: "absolute",

    bottom: 70,

    alignSelf: "center",

    width: "88%",

    backgroundColor: "#FFFFFF",

    paddingVertical: 28,
    paddingHorizontal: 24,

    borderRadius: 34,

    alignItems: "center",

    borderWidth: 1,
    borderColor: "#EADBC8",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.20,
    shadowRadius: 20,
    elevation: 10,
  },

  successEmoji: {
    fontSize: 46,
    marginBottom: 10,
  },

  successTitle: {
    color: "#262626",

    fontSize: 24,
    fontWeight: "900",

    marginBottom: 6,
  },

  successText: {
    color: "#C97C4A",

    fontSize: 16,
    fontWeight: "700",
  },

  rewardPopup: {
    position: "absolute",

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: "rgba(0,0,0,0.82)",

    justifyContent: "center",
    alignItems: "center",

    padding: 30,

    zIndex: 999,
    elevation: 999,
  },

  rewardEmoji: {
    fontSize: 72,
    marginBottom: 20,
  },

  rewardTitle: {
    color: "#E8B07A",

    fontSize: 36,
    fontWeight: "900",

    marginBottom: 12,

    letterSpacing: 2,
  },

  rewardText: {
    color: "#FFFFFF",

    fontSize: 22,
    fontWeight: "bold",

    marginBottom: 8,
  },

  rewardSubText: {
    color: "#E8B07A",

    fontSize: 16,
  },

  customerName: {
    color: "#FFFFFF",

    fontSize: 26,

    fontWeight: "900",

    marginTop: 10,
  },

  customerLevel: {
    color: "#E8B07A",

    fontSize: 16,

    fontWeight: "700",

    marginTop: 5,

    marginBottom: 12,
  },

});