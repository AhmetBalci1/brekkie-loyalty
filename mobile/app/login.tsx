import { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
  useState("");
  const [loading, setLoading] =
  useState(false);

const [errorMessage,
setErrorMessage] =
useState("");

const [successVisible,
setSuccessVisible] =
useState(false);

  const handleLogin = async () => {
    setLoading(true);

setErrorMessage("");
    try {
 const response = await fetch(
  "https://brekkie-api.onrender.com/login",
  {
    method: "POST",

    headers: {
      "Content-Type":
        "application/json",
    },

    body: JSON.stringify({
      email,
      password,
    }),
  }
);

const data =
  await response.json();

if (data.error) {

setLoading(false);

setErrorMessage(
  "Email veya şifre hatalı ☕"
);
  return;
}

await AsyncStorage.setItem(
  "token",
  data.token
);

await AsyncStorage.setItem(
  "user",
  JSON.stringify(data.user)
);

setSuccessVisible(true);

setTimeout(() => {

  router.replace(
    "/" as any
  );

}, 1800);

router.replace("/" as any);
    } catch (error) {
      console.log(error);

     setLoading(false);

setErrorMessage(
  "Bağlantı hatası oluştu"
);
    }
  };

  return (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={
      Platform.OS === "ios"
        ? "padding"
        : "height"
    }
  >

    <ImageBackground
      source={require("../assets/images/brekkie-foto1.jpg")}
      style={styles.background}
      resizeMode="cover"
    >

      <View style={styles.overlay}>

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps="handled"
        >

      <View style={styles.container}>
        <View style={styles.card}>
        <Image
          source={require("../assets/images/brekkie-logo.png")}
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

        <Text style={styles.subtitle}>
          Hoşgeldiniz ☕
        </Text>

        <TextInput
          placeholder="Email adresiniz"
          placeholderTextColor="#cbb9a7"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
  placeholder="Şifreniz"

  placeholderTextColor="#cbb9a7"

  secureTextEntry

  style={styles.input}

  value={password}

  onChangeText={setPassword}
/>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
        >
          {loading ? (

  <ActivityIndicator
    color="#2a1d17"
  />

) : (

  <Text style={styles.buttonText}>
    Giriş Yap
  </Text>

)}

        </TouchableOpacity>
        {errorMessage !== "" && (

  <View style={styles.errorPopup}>

    <Text style={styles.errorText}>
      {errorMessage}
    </Text>

  </View>
)}

{successVisible && (

  <View style={styles.successPopup}>

    <Text style={styles.successEmoji}>
      ☕
    </Text>

    <Text style={styles.successTitle}>
      Hoş Geldin
    </Text>

    <Text style={styles.successText}>
      BREKKIE CLUB'a giriş yapıldı
    </Text>

  </View>
)}
   <TouchableOpacity
  onPress={() =>
    router.push("/forgot-password" as any)
  }
>
  <Text
    style={{
      color: "#d4af37",
      marginTop: 15,
      textAlign: "center",
      fontWeight: "700",
    }}
  >
    Şifremi Unuttum?
  </Text>
</TouchableOpacity>
           </View>
          </View>
        </ScrollView>

      </View>

    </ImageBackground>

  </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    backgroundColor: "rgba(0,66,37,0.82)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 35,
    padding: 28,
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

  logo: {
    width: 120,
    height: 120,
    borderRadius: 65,
    marginBottom: 20,
  },

  titleWrapper: {
    position: "relative",
    marginBottom: 25,
    alignItems: "center",
  },

  titleShadow: {
    position: "absolute",

    top: 4,
    left: 3,

    color: "#1e140f",

    fontSize: 40,
    fontWeight: "900",
    letterSpacing: 4,
  },

  title: {
    color: "#fff4e3",

    fontSize: 40,
    fontWeight: "900",
    letterSpacing: 4,
  },

  clubShadow: {
    position: "absolute",

    top: 48,

    alignSelf: "center",

    color: "#1e140f",

    fontSize: 35,
    fontWeight: "900",
    letterSpacing: 8,
  },

  club: {
    marginTop: -2,

    color: "#fff4e3",

    fontSize: 35,
    fontWeight: "900",
    letterSpacing: 8,

    textAlign: "center",
  },

  subtitle: {
    color: "#d4af37",
    marginBottom: 30,
    fontSize: 22,
  },

  input: {
    width: "100%",

    backgroundColor: "#0b5d38",
    color: "#fff4e3",

    padding: 18,
    borderRadius: 20,

    marginBottom: 20,

    fontSize: 16,
  },

  button: {
    width: "100%",

    backgroundColor: "#d4af37",

    paddingVertical: 18,

    borderRadius: 22,

    alignItems: "center",
  },

  buttonText: {
    color: "#2a1d17",

    fontSize: 18,
    fontWeight: "bold",
  },
  errorPopup: {

  width: "100%",

  backgroundColor: "#5c1f1f",

  padding: 16,

  borderRadius: 18,

  marginTop: 18,

  alignItems: "center",
},

errorText: {

  color: "#fff",

  fontWeight: "700",

  fontSize: 15,
},

successPopup: {

  width: "100%",

  backgroundColor: "#0b5d38",

  padding: 22,

  borderRadius: 22,

  marginTop: 20,

  alignItems: "center",
},

successEmoji: {

  fontSize: 38,

  marginBottom: 10,
},

successTitle: {

  color: "#fff",

  fontSize: 22,

  fontWeight: "800",

  marginBottom: 6,
},

successText: {

  color: "#d4af37",

  fontSize: 15,
},
background: {
  flex: 1,
},

overlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.35)",
},
});