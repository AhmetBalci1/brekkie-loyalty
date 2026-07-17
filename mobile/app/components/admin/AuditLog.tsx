import { useEffect, useState } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";

type Log = {
  id: number;
  user_role: string;
  action: string;
  description: string;
  created_at: string;
};

export default function AuditLog() {

  const [logs, setLogs] =
    useState<Log[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetch(
      "https://brekkie-api.onrender.com/audit-logs"
    )
      .then((res) => res.json())
      .then((data) => {

        setLogs(data);

      })
      .catch(console.log)
      .finally(() => {

        setLoading(false);

      });

  }, []);

  if (loading) {

    return (

      <View style={styles.loading}>

        <ActivityIndicator
          size="large"
          color="#004225"
        />

      </View>

    );

  }

  return (

    <View style={styles.card}>

      <View style={styles.header}>

  <Text style={styles.title}>
    🕒 Yönetim Geçmişi
  </Text>

  <TouchableOpacity
    onPress={() =>
      router.push("/admin/audit-log")
    }
  >

    <Text style={styles.more}>
      Tümünü Gör →
    </Text>

  </TouchableOpacity>

</View>

     {logs.length === 0 ? (

  <Text style={styles.empty}>
    Henüz kayıt yok.
  </Text>

) : (

  <ScrollView
    style={styles.logContainer}
    showsVerticalScrollIndicator={false}
  >

    {logs.slice(0,5).map((log) => (

      <View
        key={log.id}
        style={styles.item}
      >

        <Text style={styles.description}>
          {getIcon(log.action)} {log.description}
        </Text>

        <Text style={styles.role}>
          {log.user_role === "admin"
            ? "👑 Admin"
            : "👨‍🍳 Kasiyer"}
        </Text>

      </View>

    ))}

  </ScrollView>

)}

    </View>

  );

}

function getIcon(action:string){

switch(action){

case "campaign_create":
return "🎁";

case "notification_send":
return "🔔";

case "settings_update":
return "⚙️";

case "qr_scan":
return "☕";

case "reward_redeemed":
return "🎉";

default:
return "📌";

}

}

const styles = StyleSheet.create({

card:{
backgroundColor:"#004225",
borderRadius:24,
padding:20,
marginTop:20,

height: 340
},

title:{
color:"#d4af37",
fontSize:20,
fontWeight:"800",
marginBottom:18,
},

item:{
marginBottom:16,
borderBottomWidth:1,
borderBottomColor:"rgba(255,255,255,.1)",
paddingBottom:12,
},

description:{
color:"white",
fontSize:15,
fontWeight:"700",
},

role:{
color:"#d4af37",
marginTop:4,
},

loading:{
paddingVertical:40,
},

empty:{
color:"#ddd",
},
logContainer: {
  flex: 1,
},
header:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
marginBottom:18,
},

more:{
color:"#d4af37",
fontWeight:"700",
},
});