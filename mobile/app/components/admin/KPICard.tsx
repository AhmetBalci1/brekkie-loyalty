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

    backgroundColor: "#FFFFFF", // Eski: #004225

    borderRadius: 28,

    paddingVertical: 28,

    alignItems: "center",

    borderWidth: 1,
    borderColor: "#EADBC8",

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.05,

    shadowRadius: 8,

    elevation: 3,
  },

  value: {
    color: "#E8B07A", // Eski: #d4af37

    fontSize: 32,

    fontWeight: "900",

    marginBottom: 8,
  },

  label: {
    color: "#8A8178", // Eski: #fff4e3

    fontSize: 15,

    fontWeight: "600",
  },
});