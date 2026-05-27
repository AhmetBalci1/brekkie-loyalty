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

import AsyncStorage from "@react-native-async-storage/async-storage";

import { router } from "expo-router";

export default function ScannerScreen() {

  const [permission, requestPermission] =
    useCameraPermissions();

  const [scanned, setScanned] =
    useState(false);

  const [successVisible, setSuccessVisible] =
    useState(false);

  const [rewardVisible, setRewardVisible] =
    useState(false);

  const [coffeeCount, setCoffeeCount] =
    useState(0);

  const [customerName, setCustomerName] =
    useState("");

  const [customerLevel, setCustomerLevel] =
    useState("");

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

    if (scanned) return;

    setScanned(true);

    try {

      const savedUser =
        await AsyncStorage.getItem(
          "user"
        );

      const currentUser =
        JSON.parse(
          savedUser || "{}"
        );

      const response =
        await fetch(
          "http://192.168.1.195:5000/scan",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              qr_code: data,
            }),
          }
        );

      const result =
        await response.json();

      if (result.error) {

        console.log(
          result.error
        );

        setScanned(false);

        return;
      }

      const updatedUser = {

        id:
          result.id ||
          currentUser.id,

        name:
          result.name ||
          currentUser.name,

        email:
          result.email ||
          currentUser.email,

        qr_code:
          result.qr_code ||
          currentUser.qr_code,

        coffee_count:
          result.coffee_count,

        free_coffee:
          result.free_coffee,
      };

      await AsyncStorage.setItem(
        "user",
        JSON.stringify(
          updatedUser
        )
      );

      setCoffeeCount(
        result.coffee_count
      );

      setCustomerName(
        updatedUser.name
      );

      const totalCoffee =
        result.coffee_count +
        result.free_coffee * 10;

      let level =
        "Bronze ☕";

      if (totalCoffee >= 10) {
        level = "Silver ✨";
      }

      if (totalCoffee >= 25) {
        level = "Gold 👑";
      }

      if (totalCoffee >= 50) {
        level = "Emerald 💎";
      }

      setCustomerLevel(level);

      if (
        result.coffee_count === 0 &&
        result.free_coffee > 0
      ) {

        setRewardVisible(true);

        setTimeout(() => {

          router.replace(
            "/cashier" as any
          );

        }, 3500);

        return;
      }

      setSuccessVisible(true);

      setTimeout(() => {

        router.replace(
          "/cashier" as any
        );

      }, 1800);

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
          handleBarcodeScanned
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

      {rewardVisible && (

        <View
          style={styles.rewardPopup}
        >

          <Text
            style={styles.rewardEmoji}
          >
            🎉
          </Text>

          <Text
            style={styles.rewardTitle}
          >
            ÜCRETSİZ KAHVE!
          </Text>

          <Text
            style={styles.rewardText}
          >
            Ücretsiz kahve
            kazandınız ☕
          </Text>

          <Text
            style={
              styles.rewardSubText
            }
          >
            Hesabınıza 1 ödül
            eklendi
          </Text>

        </View>
      )}

      {successVisible &&
        !rewardVisible && (

        <View
          style={
            styles.successPopup
          }
        >

          <Text
            style={
              styles.successEmoji
            }
          >
            ☕
          </Text>

          <Text
            style={
              styles.successTitle
            }
          >
            Kahve Eklendi
          </Text>

          <Text
            style={
              styles.customerName
            }
          >
            {customerName}
          </Text>

          <Text
            style={
              styles.customerLevel
            }
          >
            {customerLevel}
          </Text>

          <Text
            style={
              styles.successText
            }
          >
            Toplam Kahve:
            {" "}
            {coffeeCount}
          </Text>

        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },

  overlay: {
    position: "absolute",

    top: 80,

    width: "100%",

    alignItems: "center",
  },

  scanText: {
    color: "#fff4e3",

    fontSize: 20,
    fontWeight: "bold",

    backgroundColor:
      "rgba(0,66,37,0.9)",

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

  backgroundColor: "rgba(255,255,255,0.03)",

  borderRadius: 30,

  borderWidth: 1.5,
  borderColor: "rgba(255,255,255,0.08)",
},

  cornerTopLeft: {
    position: "absolute",

    top: 0,
    left: 0,

    width: 50,
    height: 50,

    borderTopWidth: 6,
    borderLeftWidth: 6,

    borderColor: "#d4af37",

    borderTopLeftRadius: 22,
    shadowColor: "#d4af37",

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

    borderColor: "#d4af37",

    borderTopRightRadius: 22,

    shadowColor: "#d4af37",

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

    borderColor: "#d4af37",

    borderBottomLeftRadius: 22,

    shadowColor: "#d4af37",

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

    borderColor: "#d4af37",

    borderBottomRightRadius: 22,

    shadowColor: "#d4af37",

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

    backgroundColor: "#d4af37",

    borderRadius: 10,

    shadowColor: "#d4af37",

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

  backgroundColor: "#004225",

  paddingVertical: 28,
  paddingHorizontal: 24,

  borderRadius: 34,

  alignItems: "center",

  shadowColor: "#000",

  shadowOffset: {
    width: 0,
    height: 10,
  },

  shadowOpacity: 0.3,

  shadowRadius: 20,

  elevation: 14,

  borderWidth: 1.5,
  borderColor: "rgba(212,175,55,0.3)",
},

successEmoji: {
  fontSize: 46,

  marginBottom: 10,
},

  successTitle: {
    color: "#fff4e3",

    fontSize: 24,
    fontWeight: "900",

    marginBottom: 6,
  },

  successText: {
    color: "#d4af37",

    fontSize: 16,
    fontWeight: "700",
  },

  rewardPopup: {
    position: "absolute",

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor:
      "rgba(0,0,0,0.8)",

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
    color: "#d4af37",

    fontSize: 36,
    fontWeight: "900",

    marginBottom: 12,

    letterSpacing: 2,
  },

  rewardText: {
    color: "#fff4e3",

    fontSize: 22,
    fontWeight: "bold",

    marginBottom: 8,
  },

  rewardSubText: {
    color: "#d4af37",

    fontSize: 16,
  },

  customerName: {
  color: "#fff4e3",

  fontSize: 26,

  fontWeight: "900",

  marginTop: 10,
},

customerLevel: {
  color: "#d4af37",

  fontSize: 16,

  fontWeight: "700",

  marginTop: 5,

  marginBottom: 12,
},
});