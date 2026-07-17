import { View, Text, StyleSheet } from "react-native";

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export default function SettingsAppInfo() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        ℹ️ Uygulama
      </Text>

      <InfoRow
        label="Uygulama"
        value="Brekkie POS"
      />

      <InfoRow
        label="Versiyon"
        value="v1.0.0"
      />

      <InfoRow
        label="Backend"
        value="🟢 Online"
      />

      <InfoRow
        label="Database"
        value="🟢 Connected"
      />

      <InfoRow
        label="Push Servisi"
        value="🟢 Active"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
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
    marginBottom: 14,
  },

  label: {
    color: "#555",
    fontWeight: "600",
  },

  value: {
    color: "#004225",
    fontWeight: "700",
  },
});