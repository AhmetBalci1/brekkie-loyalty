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

  icon: {
    fontSize: 34,
    marginBottom: 10,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#262626", // Eski: #004225
  },
});