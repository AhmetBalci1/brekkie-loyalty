import { View, Text, StyleSheet } from "react-native";

type Props = {
  value: string | number;
  label: string;
};

export default function KPICard({
  value,
  label,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>

      <Text style={styles.label}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#004225",
    borderRadius: 28,
    paddingVertical: 28,
    alignItems: "center",
    elevation: 8,
  },

  value: {
    color: "#d4af37",
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 8,
  },

  label: {
    color: "#fff4e3",
    fontSize: 15,
    fontWeight: "600",
  },
});