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
  Cashier & Admin Access
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

  if (
    username !== "Cashier" ||
    password !== "1234"
  ) {

    Alert.alert(
      "Hata",
      "Bilgiler yanlış"
    );

    return;
  }

  await AsyncStorage.setItem(
    "staff",
    "true"
  );

  router.replace(
    "/staff/cashier" as any
  );
}}
      >
        <Text style={styles.buttonText}>
          Cashier Mode
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.adminButton}

 onPress={async () => {

  if (
    username !== "Admin" ||
    password !== "1234"
  ) {

    Alert.alert(
      "Hata",
      "Bilgiler yanlış"
    );

    return;
  }

  await AsyncStorage.setItem(
    "staff",
    "true"
  );

  router.replace(
    "/staff/admin" as any
  );
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
    color: "white",

    fontSize: 30,

    fontWeight: "bold",

    marginBottom: 40,
  },

  button: {
    width: "100%",

    backgroundColor: "#c59d5f",

    padding: 18,

    borderRadius: 18,

    alignItems: "center",

    marginBottom: 20,
  },

  adminButton: {
    width: "100%",

    backgroundColor: "#004225",

    padding: 18,

    borderRadius: 18,

    alignItems: "center",
  },

  buttonText: {
    color: "white",

    fontSize: 18,

    fontWeight: "700",
  },
  input: {

  width: "100%",

  backgroundColor: "rgba(0,66,37,0.75)",

  color: "white",

  padding: 16,

  borderRadius: 16,

  marginBottom: 14,

  borderWidth: 1,

  borderColor: "#444",
},
background: {
  flex: 1,
},

overlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.45)",
},
});