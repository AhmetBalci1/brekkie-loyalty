import { TouchableOpacity, Text, StyleSheet } from "react-native";

type Props = {
  icon: string;
  title: string;
  onPress: () => void;
};

export default function QuickActionCard({
  icon,
  title,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
    >
      <Text style={styles.icon}>
        {icon}
      </Text>

      <Text style={styles.title}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    paddingVertical: 24,
    borderRadius: 22,
    alignItems: "center",
    marginBottom: 16,
    elevation: 4,
  },

  icon: {
    fontSize: 34,
    marginBottom: 10,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#004225",
  },
});