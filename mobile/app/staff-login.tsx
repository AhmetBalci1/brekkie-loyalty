import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  TextInput,
  Alert,
} from "react-native";

import {
  useState,
} from "react";

import { router } from "expo-router";

export default function StaffLogin() {
const [username, setUsername] =
  useState("");

const [password, setPassword] =
  useState("");
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

      
      <Text
  style={{
    color: "#d4af37",
    marginBottom: 30,
  }}
>
  Kasiyer % Admin Girişi
</Text>
      <TextInput
  placeholder="Kullanıcı Adı"

  placeholderTextColor="#999"

  value={username}

  onChangeText={setUsername}

  style={styles.input}
/>

<TextInput
  placeholder="Şifre"

  placeholderTextColor="#999"

  secureTextEntry

  value={password}

  onChangeText={setPassword}

  style={styles.input}
/>

      <TouchableOpacity
        style={styles.button}

onPress={async () => {

  try {

    const response = await fetch(
      "https://brekkie-api.onrender.com/staff-login",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username,
          password,
        }),

      }
    );

    const data = await response.json();

    if (!response.ok) {

      Alert.alert(
        "Hata",
        data.error
      );

      return;

    }

    if (data.role !== "cashier") {

      Alert.alert(
        "Hata",
        "Kasiyer hesabı ile giriş yapınız."
      );

      return;

    }

   await AsyncStorage.setItem("staff", "true");

await AsyncStorage.setItem(
  "staffId",
  data.id.toString()
);

await AsyncStorage.setItem(
  "staffName",
  data.name
);

await AsyncStorage.setItem(
  "staffRole",
  data.role
);

router.replace(
  "/staff/cashier" as any
);
  } catch {

    Alert.alert(
      "Hata",
      "Sunucuya bağlanılamadı."
    );

  }

}}
      >
        <Text style={styles.buttonText}>
          Kasiyer
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.adminButton}

 onPress={async () => {

  try {

    const response = await fetch(
      "https://brekkie-api.onrender.com/staff-login",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username,
          password,
        }),

      }
    );

    const data = await response.json();

    if (!response.ok) {

      Alert.alert(
        "Hata",
        data.error
      );

      return;

    }

    if (data.role !== "admin") {

      Alert.alert(
        "Hata",
        "Admin hesabı ile giriş yapınız."
      );

      return;

    }

    await AsyncStorage.setItem("staff", "true");

await AsyncStorage.setItem(
  "staffId",
  data.id.toString()
);

await AsyncStorage.setItem(
  "staffName",
  data.name
);

await AsyncStorage.setItem(
  "staffRole",
  data.role
);

router.replace(
  "/admin" as any
);

  } catch {

    Alert.alert(
      "Hata",
      "Sunucuya bağlanılamadı."
    );

  }

}}
      >
        <Text style={styles.buttonText}>
          Admin Dashboard
        </Text>
      </TouchableOpacity>

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

  title: {
    color: "#262626",

    fontSize: 30,

    fontWeight: "bold",

    marginBottom: 40,
  },

  button: {
    width: "100%",

    backgroundColor: "#E8B07A",

    padding: 18,

    borderRadius: 18,

    alignItems: "center",

    marginBottom: 20,
  },

  adminButton: {
    width: "100%",

    backgroundColor: "#EADBC8",

    padding: 18,

    borderRadius: 18,

    alignItems: "center",
  },

  buttonText: {
    color: "#262626",

    fontSize: 18,

    fontWeight: "700",
  },
  input: {

  width: "100%",

  backgroundColor: "rgba(255,255,255,0.75)",

  color: "#262626",

  padding: 16,

  borderRadius: 16,

  marginBottom: 14,

  borderWidth: 1,

  borderColor: "#E5D7C7",
},
background: {
  flex: 1,
},

overlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.22)",
},
});