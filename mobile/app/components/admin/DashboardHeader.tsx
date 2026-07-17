import { View, Text, StyleSheet,Image, } from "react-native";

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

     <Image
  source={require("../../../assets/images/brekkie-logo.png")}
  style={styles.logo}
/>

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
    color: "#8A8178", // Eski: #7A7A7A
    marginBottom: 6,
  },

  title: {
    color: "#262626", // Eski: #004225
    fontSize: 25,
    fontWeight: "900",
    letterSpacing: 2,
  },

  subtitle: {
    color: "#C97C4A", // Eski: #0b5d38
    fontSize: 16,
    marginTop: 6,
  },

  logoContainer: {
    width: 64,
    height: 64,

    backgroundColor: "#E8B07A", // Eski: #004225

    borderRadius: 20,

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "#EADBC8",

    shadowColor: "#E8B07A",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.20,
    shadowRadius: 8,
    elevation: 4,
  },

  logo: {
  width: 100,
  height: 100,
},
});