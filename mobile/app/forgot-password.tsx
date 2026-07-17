import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function ForgotPassword() {

  const [email, setEmail] =
    useState("");

  const [token, setToken] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [mailSent, setMailSent] =
    useState(false);

  const handleSendMail =
    async () => {

      try {

        const response =
          await fetch(
            "https://brekkie-api.onrender.com/forgot-password",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                email,
              }),
            }
          );

        const result =
          await response.json();

        if (result.success) {

          setMailSent(true);

          Alert.alert(
            "Başarılı",
            "Kod email adresinize gönderildi."
          );

        } else {

          Alert.alert(
            "Hata",
            result.error
          );
        }

      } catch (error) {

        Alert.alert(
          "Hata",
          "Sunucu hatası"
        );
      }
    };

  const handleResetPassword =
    async () => {

      try {

        const response =
          await fetch(
            "https://brekkie-api.onrender.com/reset-password",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                token,
                password,
              }),
            }
          );

        const result =
          await response.json();

        if (result.success) {

          Alert.alert(
            "Başarılı",
            "Şifreniz güncellendi."
          );

        } else {

          Alert.alert(
            "Hata",
            result.error
          );
        }

      } catch (error) {

        Alert.alert(
          "Hata",
          "Sunucu hatası"
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
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>

      <Text style={styles.title}>
        Şifremi Unuttum
      </Text>

      {!mailSent ? (

        <>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSendMail}
          >
            <Text style={styles.buttonText}>
              Mail Gönder
            </Text>
          </TouchableOpacity>
        </>

      ) : (

        <>
          <TextInput
            placeholder="Maildeki Kod"
            value={token}
            onChangeText={setToken}
            style={styles.input}
          />

          <TextInput
            placeholder="Yeni Şifre"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleResetPassword}
          >
            <Text style={styles.buttonText}>
              Şifreyi Güncelle
            </Text>
          </TouchableOpacity>
        </>
      )}

      </View>
    </ScrollView>
  </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({

  container: {
    flex: 1,

    justifyContent: "center",

    padding: 24,

    backgroundColor: "#F8F5F0", // Eski: #004225
  },

  title: {
    color: "#262626", // Eski: #fff4e3

    fontSize: 28,

    fontWeight: "bold",

    marginBottom: 20,

    textAlign: "center",
  },

  input: {
    backgroundColor: "#FFFFFF",

    borderRadius: 14,

    padding: 15,

    marginBottom: 20,

    borderWidth: 1,

    borderColor: "#EADBC8",

    color: "#262626",

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.04,

    shadowRadius: 4,

    elevation: 2,
  },

  button: {
    backgroundColor: "#E8B07A", // Eski: #d4af37

    padding: 18,

    borderRadius: 14,

    shadowColor: "#E8B07A",

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.20,

    shadowRadius: 8,

    elevation: 4,
  },

  buttonText: {
    textAlign: "center",

    color: "#262626",

    fontWeight: "bold",

    fontSize: 16,
  },

});