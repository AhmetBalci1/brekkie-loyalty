import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Image,
} from "react-native";

import {
  useEffect,
  useRef,
} from "react";

import AsyncStorage
from "@react-native-async-storage/async-storage";

import { router }
from "expo-router";

export default function SplashScreen() {

  const fadeAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  const scaleAnim =
    useRef(
      new Animated.Value(0.8)
    ).current;

  useEffect(() => {

    Animated.parallel([

      Animated.timing(
        fadeAnim,
        {
          toValue: 1,

          duration: 1200,

          useNativeDriver: true,
        }
      ),

      Animated.timing(
        scaleAnim,
        {
          toValue: 1,

          duration: 1200,

          useNativeDriver: true,
        }
      ),
    ]).start();

    const checkSession =
      async () => {

      const user =
        await AsyncStorage.getItem(
          "user"
        );

      setTimeout(() => {

        if (user) {

          router.replace(
            "/(tabs)" as any
          );

        } else {

          router.replace(
            "/" as any
          );
        }

      }, 2200);
    };

    checkSession();

  }, []);

  return (

    <View style={styles.container}>

     <Animated.View
  style={{
    opacity: fadeAnim,

    alignItems: "center",

    justifyContent: "center",

    transform: [
      {
        scale: scaleAnim,
      },
    ],
  }}
>

        <Image
          source={require(
            "../assets/images/brekkie-logo-adaptive-25.png"
          )}

          style={styles.logo}
        />

        <Text style={styles.title}>
          BREKKIE
        </Text>

        <Text style={styles.club}>
          CLUB
        </Text>

      </Animated.View>

      <ActivityIndicator
        size="large"

        color="#d4af37"

        style={{
          marginTop: 40,
        }}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: "#F8F5F0", // Eski: #004225

    justifyContent: "center",

    alignItems: "center",
  },

  logo: {

    width: 140,

    height: 140,

    borderRadius: 70,

    marginBottom: 25,

    alignSelf: "center",

    shadowColor: "#E8B07A",

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.20,

    shadowRadius: 12,

    elevation: 8,
  },

  title: {

    color: "#262626", // Eski: #fff4e3

    fontSize: 42,

    fontWeight: "900",

    letterSpacing: 5,

    textAlign: "center",
  },

  club: {

    color: "#C97C4A", // Eski: #d4af37

    fontSize: 34,

    fontWeight: "900",

    letterSpacing: 8,

    textAlign: "center",
  },

});