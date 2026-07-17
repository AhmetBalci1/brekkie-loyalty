import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";

type Props = {
  staffName: string;
  staffRole: string;
};

export default function HeaderCard({
  staffName,
  staffRole,
}: Props) {

  const [currentTime, setCurrentTime] =
    useState(new Date());

  useEffect(() => {

    const interval = setInterval(() => {

      setCurrentTime(new Date());

    }, 60000);

    return () => clearInterval(interval);

  }, []);

  const time =
    currentTime.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (

    <View style={styles.card}>

      <View>

        <Text style={styles.logo}>
          ☕ BREKKIE POS
        </Text>

        <Text style={styles.name}>
           {staffName}:
        </Text>

        <Text style={styles.role}>
          {staffRole === "admin"
            ? "👑 Admin"
            : "-Kasiyer"}
        </Text>

      </View>

      <View>

        <Text style={styles.online}>
          🟢 Online
        </Text>

        <Text style={styles.time}>
          {time}
        </Text>

      </View>

    </View>

  );

}

const styles = StyleSheet.create({

  card:{
    backgroundColor:"#FFFFFF",      // Eski: #004225

    borderRadius:26,

    padding:22,

    flexDirection:"row",

    justifyContent:"space-between",

    alignItems:"center",

    marginBottom:20,

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

  logo:{
    color:"#E8B07A",                // Eski: #d4af37
    fontSize:24,
    fontWeight:"900",
  },

  name:{
    color:"#262626",                // Eski: white
    fontSize:20,
    fontWeight:"800",
    marginTop:12,
  },

  role:{
    color:"#C97C4A",                // Eski: #d4af37
    marginTop:4,
    fontSize:15,
    fontWeight:"700",
  },

  online:{
    color:"#4CAF50",                // Online için yeşili koruyoruz
    fontWeight:"700",
    textAlign:"right",
  },

  time:{
    color:"#262626",                // Eski: white
    fontSize:28,
    fontWeight:"900",
    marginTop:16,
  },

});