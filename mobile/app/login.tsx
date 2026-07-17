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
      source={require("../assets/images/brekkie-foto2.png")}
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
      color: "#262626",
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
    backgroundColor: "rgba(248,245,240,0.72)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
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

    color: "rgba(0,0,0,0.18)",

    fontSize: 40,
    fontWeight: "900",
    letterSpacing: 4,
  },

  title: {
    color: "#262626",

    fontSize: 40,
    fontWeight: "900",
    letterSpacing: 4,
  },

  subtitle: {
    color: "#262626",
    marginBottom: 30,
    fontSize: 22,
  },

  input: {
    width: "100%",

    backgroundColor: "rgba(255,255,255,0.75)",
color: "#262626",

borderWidth: 1,
borderColor: "#E5D7C7",

    padding: 18,
    borderRadius: 20,

    marginBottom: 20,

    fontSize: 16,
  },

  button: {
    width: "100%",

    backgroundColor: "#F1B993",

    paddingVertical: 18,

    borderRadius: 22,

    alignItems: "center",
  },

  buttonText: {
    color: "#262626",

    fontSize: 18,
    fontWeight: "bold",
  },
  errorPopup: {

  width: "100%",

  backgroundColor: "#E8A6A0",

  padding: 16,

  borderRadius: 18,

  marginTop: 18,

  alignItems: "center",
},

errorText: {

  color: "#7A1F1F",

  fontWeight: "700",

  fontSize: 15,
},

successPopup: {

  width: "100%",

  backgroundColor: "#EADBC8",

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

  color: "#262626",

  fontSize: 22,

  fontWeight: "800",

  marginBottom: 6,
},

successText: {

  color: "#C97C4A",

  fontSize: 15,
},
background: {
  flex: 1,
},

overlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.22)",
},
});