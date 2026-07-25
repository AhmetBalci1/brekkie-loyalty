import { useState } from "react";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleRegister = async () => {
    if (!name.trim()) {
  Alert.alert("Eksik Bilgi", "Lütfen isminizi giriniz.");
  return;
}

if (!email.trim()) {
  Alert.alert("Eksik Bilgi", "Lütfen e-posta adresinizi giriniz.");
  return;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  Alert.alert(
    "Geçersiz E-posta",
    "Lütfen geçerli bir e-posta adresi giriniz."
  );
  return;
}

if (password.length < 8) {
  Alert.alert(
    "Geçersiz Şifre",
    "Şifre en az 8 karakter olmalıdır."
  );
  return;
}

if (password !== confirmPassword) {
  Alert.alert(
    "Şifre Hatası",
    "Şifreler birbiriyle uyuşmuyor."
  );
  return;
}
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
  "Hesabınız oluşturuldu.",
  [
    {
      text: "Tamam",
      onPress: () => router.replace("/login"),
    },
  ]
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
  source={require("../assets/images/brekkie-foto3.png")}
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
        <View style={styles.passwordContainer}>

  <TextInput
    placeholder="Şifreniz"
    placeholderTextColor="#cbb9a7"
    secureTextEntry={!showPassword}
    style={styles.passwordInput}
    value={password}
    onChangeText={setPassword}
  />

  <TouchableOpacity
    onPress={() => setShowPassword(!showPassword)}
  >
    <MaterialCommunityIcons
      name={showPassword ? "eye-off" : "eye"}
      size={24}
      color="#777"
    />
  </TouchableOpacity>

</View>
<View style={styles.passwordContainer}>

  <TextInput
    placeholder="Şifrenizi tekrar girin"
    placeholderTextColor="#cbb9a7"
    secureTextEntry={!showConfirmPassword}
    style={styles.passwordInput}
    value={confirmPassword}
    onChangeText={setConfirmPassword}
  />

  <TouchableOpacity
    onPress={() =>
      setShowConfirmPassword(!showConfirmPassword)
    }
  >
    <MaterialCommunityIcons
      name={
        showConfirmPassword
          ? "eye-off"
          : "eye"
      }
      size={24}
      color="#777"
    />
  </TouchableOpacity>

</View>

{confirmPassword.length > 0 &&
  password !== confirmPassword && (
    <Text style={styles.errorText}>
      Şifreler eşleşmiyor.
    </Text>
)}

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

  clubShadow: {
    position: "absolute",

    top: 48,

    alignSelf: "center",

    color: "rgba(0,0,0,0.18)",

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
    color: "#262626",
    marginBottom: 30,
    fontSize: 20,
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

 background: {
  flex: 1,
},

overlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.22)",
},
errorText: {
  width: "100%",
  color: "#D9534F",
  fontSize: 13,
  fontWeight: "600",
  marginTop: -14,
  marginBottom: 16,
},
passwordContainer: {
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "rgba(255,255,255,0.75)",
  borderWidth: 1,
  borderColor: "#E5D7C7",
  borderRadius: 20,
  paddingHorizontal: 18,
  marginBottom: 20,
},

passwordInput: {
  flex: 1,
  color: "#262626",
  fontSize: 16,
  paddingVertical: 18,
},
});