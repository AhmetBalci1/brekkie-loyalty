import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
type Props = {
  name: string;
  coffeeCount: number;
  freeCoffee: number;
  membership: string;
  onAddCoffee: () => void;
  onUseReward: () => void;
};
export default function CustomerCard({
  name,
  coffeeCount,
  freeCoffee,
  membership,
  onAddCoffee,
  onUseReward,
}: Props) {

  const progress =
    Math.min((coffeeCount % 10) * 10, 100);

  return (

    <View style={styles.card}>

      <Text style={styles.title}>
        👤 Son Müşteri
      </Text>

      <Text style={styles.name}>
        {name || "-"}
      </Text>

      <Text style={styles.membership}>
        🏅 {membership || "Standart"}
      </Text>

      <View style={styles.progressBackground}>

        <View
          style={[
            styles.progressFill,
            {
              width: `${progress}%`,
            },
          ]}
        />

      </View>

      <Text style={styles.coffee}>
        ☕ {coffeeCount} / 10 Kahve
      </Text>

      <Text style={styles.reward}>
        🎁 Ücretsiz Kahve: {freeCoffee}
      </Text>
      <TouchableOpacity
  style={styles.coffeeButton}
  onPress={onAddCoffee}
>
  <Text style={styles.coffeeButtonText}>
    ☕ KAHVE SAT
  </Text>
</TouchableOpacity>
{freeCoffee > 0 && (

  <TouchableOpacity
    style={styles.rewardButton}
    onPress={onUseReward}
  >

    <Text style={styles.rewardButtonText}>
      ☕ ÖDÜLÜ KULLAN
    </Text>

  </TouchableOpacity>

)}
    </View>

  );

}

const styles = StyleSheet.create({

  card:{
    backgroundColor:"#FFFFFF",
    borderRadius:24,
    padding:22,
    marginBottom:20,

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

  title:{
    fontSize:20,
    fontWeight:"800",
    color:"#262626",          // Eski: #004225
    marginBottom:14,
  },

  name:{
    fontSize:24,
    fontWeight:"900",
    color:"#262626",          // Aynı kalabilir
  },

  membership:{
    marginTop:6,
    color:"#C97C4A",          // Eski: #d4af37
    fontWeight:"700",
    fontSize:16,
  },

  progressBackground:{
    marginTop:18,
    height:12,
    backgroundColor:"#EEE5DA", // Eski: #ececec
    borderRadius:8,
    overflow:"hidden",
  },

  progressFill:{
    height:12,
    backgroundColor:"#E8B07A", // Eski: #004225
  },

  coffee:{
    marginTop:14,
    fontWeight:"700",
    color:"#262626",          // Eski: #004225
  },

  reward:{
    marginTop:8,
    color:"#8A8178",          // Eski: #666
  },

  rewardButton:{
    marginTop:18,

    backgroundColor:"#E8B07A", // Eski: #d4af37

    paddingVertical:16,

    borderRadius:18,

    alignItems:"center",

    shadowColor:"#E8B07A",
    shadowOffset:{
      width:0,
      height:4,
    },
    shadowOpacity:0.20,
    shadowRadius:8,

    elevation:4,
  },

  rewardButtonText:{
    color:"#262626",          // Eski: #004225

    fontWeight:"900",

    fontSize:16,
  },

  coffeeButton:{
    marginTop:18,

    backgroundColor:"#DCC8B4", // Eski: #004225

    paddingVertical:16,

    borderRadius:18,

    alignItems:"center",
  },

  coffeeButtonText:{
    color:"#262626",          // Eski: #fff4e3

    fontWeight:"900",

    fontSize:16,
  },

});