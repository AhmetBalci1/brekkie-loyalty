import { View, Text, StyleSheet, Switch } from "react-native";

type Props = {
  pushNotifications: boolean;
  setPushNotifications: (value: boolean) => void;

  campaignNotifications: boolean;
  setCampaignNotifications: (value: boolean) => void;

  geofenceNotifications: boolean;
  setGeofenceNotifications: (value: boolean) => void;
};

export default function SettingsNotifications({
  pushNotifications,
  setPushNotifications,
  campaignNotifications,
  setCampaignNotifications,
  geofenceNotifications,
  setGeofenceNotifications,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>🔔 Bildirimler</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Push Bildirimleri</Text>
        <Switch
          value={pushNotifications}
          onValueChange={setPushNotifications}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Kampanya Bildirimleri</Text>
        <Switch
          value={campaignNotifications}
          onValueChange={setCampaignNotifications}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Geofence Bildirimleri</Text>
        <Switch
          value={geofenceNotifications}
          onValueChange={setGeofenceNotifications}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 4,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#004225",
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  label: {
    fontSize: 16,
    color: "#444",
    fontWeight: "600",
  },
});