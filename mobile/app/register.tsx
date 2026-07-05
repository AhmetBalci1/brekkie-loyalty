import { useState } from "react";
import { router } from "expo-router";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from "react-native";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
  useState("");

  const handleRegister = async () => {
    try {
      const response = await fetch(
        "https://brekkie-api.onrender.com/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            qr_code: Math.random()
              .toString(36)
              .substring(7),
          }),
        }
      );

      await response.json();

      Alert.alert(
        "Başarılı 🎉",
        "Hesabınız oluşturuldu"
      );
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Hata",
        "Kayıt başarısız"
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
  source={require("../assets/images/brekkie-foto3.jpg")}
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
          Brekkie Club'a Katıl! ☕

        </Text>

        <TextInput
          placeholder="İsim"
          placeholderTextColor="#cbb9a7"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

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
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>
            Kayıt Ol ✨
 
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
    width: 150,
    height: 150,
    borderRadius: 50,
    marginBottom: 25,
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

    color: "#002814",

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

    color: "#002814",

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
    fontSize: 20,
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

 background: {
  flex: 1,
},

overlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.35)",
},
});