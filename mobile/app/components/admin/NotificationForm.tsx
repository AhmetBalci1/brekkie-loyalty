import { useState } from "react";
import {
  View,
 Text,
 TextInput,
 TouchableOpacity,
 StyleSheet,
 Alert,
} from "react-native";

export default function NotificationForm() {

  const [title, setTitle] = useState("");

  const [body, setBody] = useState("");

  async function sendNotification() {

    if (!title || !body) {

      Alert.alert(
        "Eksik Bilgi",
        "Başlık ve mesaj zorunludur."
      );

      return;
    }

    try {

      const response =
        await fetch(
          "https://brekkie-api.onrender.com/notifications/send-all",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              title,

              body,

            }),

          }
        );

      if (!response.ok) {

        throw new Error();

      }

      Alert.alert(
        "Başarılı",
        "Bildirim gönderildi."
      );

      setTitle("");

      setBody("");

    } catch {

      Alert.alert(
        "Hata",
        "Bildirim gönderilemedi."
      );

    }

  }

  return (

    <View style={styles.card}>

      <Text style={styles.title}>
        Yeni Bildirim
      </Text>

      <TextInput

        placeholder="Bildirim Başlığı"

        placeholderTextColor="#888"

        value={title}

        onChangeText={setTitle}

        style={styles.input}

      />

      <TextInput

        placeholder="Bildirim Mesajı"

        placeholderTextColor="#888"

        value={body}

        onChangeText={setBody}

        multiline

        style={[
          styles.input,
          {
            height:120,
            textAlignVertical:"top",
          },
        ]}

      />

      <TouchableOpacity

        style={styles.button}

        onPress={sendNotification}

      >

        <Text style={styles.buttonText}>
          Bildirimi Gönder
        </Text>

      </TouchableOpacity>

    </View>

  );

}

const styles = StyleSheet.create({

card:{
backgroundColor:"#FFFFFF",
padding:20,
borderRadius:20,

borderWidth:1,
borderColor:"#EADBC8",

shadowColor:"#000",
shadowOffset:{
  width:0,
  height:4,
},
shadowOpacity:0.05,
shadowRadius:8,

elevation:3,
},

title:{
fontSize:24,
fontWeight:"800",
color:"#262626",      // Eski: #004225
marginBottom:20,
},

input:{
borderWidth:1,
borderColor:"#EADBC8", // Eski: #ddd

borderRadius:14,

padding:14,

marginBottom:14,

backgroundColor:"#FDFBF8",

color:"#262626",
},

button:{
backgroundColor:"#E8B07A", // Eski: #004225

padding:18,

borderRadius:14,

alignItems:"center",

shadowColor:"#E8B07A",
shadowOffset:{
  width:0,
  height:4,
},
shadowOpacity:0.20,
shadowRadius:8,
elevation:4,
},

buttonText:{
color:"#262626",      // Eski: #fff

fontSize:16,

fontWeight:"700",
},

});