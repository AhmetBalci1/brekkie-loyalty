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
backgroundColor:"#fff",
padding:20,
borderRadius:20,
elevation:4,
},

title:{
fontSize:24,
fontWeight:"800",
color:"#004225",
marginBottom:20,
},

input:{
borderWidth:1,
borderColor:"#ddd",
borderRadius:14,
padding:14,
marginBottom:14,
backgroundColor:"#fff",
color:"#222",
},

button:{
backgroundColor:"#004225",
padding:18,
borderRadius:14,
alignItems:"center",
},

buttonText:{
color:"#fff",
fontSize:16,
fontWeight:"700",
},

});