import { View, Text, StyleSheet, Switch } from "react-native";
import { useState } from "react";

export default function SettingsNotifications() {

  const [pushEnabled, setPushEnabled] = useState(true);
  const [campaignEnabled, setCampaignEnabled] = useState(true);
  const [geofenceEnabled, setGeofenceEnabled] = useState(true);

  return (
    <View style={styles.card}>

      <Text style={styles.title}>
        🔔 Bildirimler
      </Text>

      <View style={styles.row}>
        <Text style={styles.label}>
          Push Bildirimleri
        </Text>

        <Switch
          value={pushEnabled}
          onValueChange={setPushEnabled}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>
          Kampanya Bildirimleri
        </Text>

        <Switch
          value={campaignEnabled}
          onValueChange={setCampaignEnabled}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>
          Geofence Bildirimleri
        </Text>

        <Switch
          value={geofenceEnabled}
          onValueChange={setGeofenceEnabled}
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  card:{
    backgroundColor:"#fff",
    padding:20,
    borderRadius:20,
    marginBottom:20,
    elevation:4,
  },

  title:{
    fontSize:22,
    fontWeight:"800",
    color:"#004225",
    marginBottom:20,
  },

  row:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    marginBottom:18,
  },

  label:{
    fontSize:16,
    color:"#444",
    fontWeight:"600",
  },

});