import { View, Text, StyleSheet } from "react-native";

export default function DashboardHeader() {
  return (
    <View style={styles.header}>

      <View>
        <Text style={styles.greeting}>
          ☀️ Günaydın
        </Text>

        <Text style={styles.title}>
          Brekkie Manager
        </Text>

        <Text style={styles.subtitle}>
          Today is looking great.
        </Text>
      </View>

      <View style={styles.logoContainer}>
        <Text style={styles.logo}>🦝</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 28,
  },

  greeting: {
    fontSize: 16,
    color: "#7A7A7A",
    marginBottom: 6,
  },

  title: {
    color: "#004225",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 2,
  },

  subtitle: {
    color: "#0b5d38",
    fontSize: 16,
    marginTop: 6,
  },

  logoContainer: {
    width: 64,
    height: 64,
    backgroundColor: "#004225",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    fontSize: 34,
  },
});