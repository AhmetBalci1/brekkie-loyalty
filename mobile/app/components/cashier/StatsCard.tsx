import { View, Text, StyleSheet } from "react-native";

type Props = {
  analytics: any;
};

export default function StatsCard({
  analytics,
}: Props) {

  return (

    <View style={styles.statsRow}>

      <View style={styles.statCard}>

        <Text style={styles.statNumber}>
          {analytics?.scans || 0}
        </Text>

        <Text style={styles.statLabel}>
          ☕ Tarama
        </Text>

      </View>

      <View style={styles.statCard}>

        <Text style={styles.statNumber}>
          {analytics?.rewards || 0}
        </Text>

        <Text style={styles.statLabel}>
          🎁 Ödül
        </Text>

      </View>

      <View style={styles.statCard}>

        <Text style={styles.statNumber}>
          {analytics?.users || 0}
        </Text>

        <Text style={styles.statLabel}>
          👥 Üye
        </Text>

      </View>

    </View>

  );

}

const styles = StyleSheet.create({

  statsRow:{
    width:"100%",
    flexDirection:"row",
    justifyContent:"space-between",
    marginBottom:18,
  },

  statCard:{
    flex:1,

    backgroundColor:"#FFFFFF",      // Eski: #0b5d38

    marginHorizontal:4,

    borderRadius:20,

    paddingVertical:18,

    alignItems:"center",

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

  statNumber:{
    color:"#E8B07A",                // Eski: #d4af37

    fontSize:22,

    fontWeight:"900",
  },

  statLabel:{
    color:"#8A8178",                // Eski: white

    marginTop:4,

    fontSize:13,

    fontWeight:"600",
  },

});