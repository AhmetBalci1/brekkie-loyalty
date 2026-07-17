import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";

type Log = {
  id: number;
  user_role: string;
  action: string;
  description: string;
  created_at: string;
};

export default function AuditLogScreen() {

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

    <View style={styles.container}>

      <Text style={styles.title}>
        📜 Tüm Yönetim Geçmişi
      </Text>

      <FlatList

        data={logs}

        keyExtractor={(item) =>
          item.id.toString()
        }

        renderItem={({ item }) => (

          <View style={styles.card}>

            <Text style={styles.description}>
              {getIcon(item.action)} {item.description}
            </Text>

            <Text style={styles.role}>
              {item.user_role === "admin"
                ? "👑 Admin"
                : "👨‍🍳 Kasiyer"}
            </Text>

          </View>

        )}

        showsVerticalScrollIndicator={false}

      />

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

container:{
flex:1,
backgroundColor:"#F5F5F5",
padding:20,
},

title:{
fontSize:28,
fontWeight:"900",
color:"#004225",
marginBottom:20,
},

card:{
backgroundColor:"white",
padding:18,
borderRadius:18,
marginBottom:14,
},

description:{
fontSize:15,
fontWeight:"700",
color:"#333",
},

role:{
marginTop:6,
color:"#888",
},

loading:{
flex:1,
justifyContent:"center",
alignItems:"center",
},

});