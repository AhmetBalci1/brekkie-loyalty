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
    backgroundColor:"#ffffff",
    borderRadius:24,
    padding:22,
    marginBottom:20,
  },

  title:{
    fontSize:20,
    fontWeight:"800",
    color:"#004225",
    marginBottom:14,
  },

  name:{
    fontSize:24,
    fontWeight:"900",
    color:"#222",
  },

  membership:{
    marginTop:6,
    color:"#d4af37",
    fontWeight:"700",
    fontSize:16,
  },

  progressBackground:{
    marginTop:18,
    height:12,
    backgroundColor:"#ececec",
    borderRadius:8,
    overflow:"hidden",
  },

  progressFill:{
    height:12,
    backgroundColor:"#004225",
  },

  coffee:{
    marginTop:14,
    fontWeight:"700",
    color:"#004225",
  },

  reward:{
    marginTop:8,
    color:"#666",
  },
rewardButton:{
  marginTop:18,
  backgroundColor:"#d4af37",
  paddingVertical:16,
  borderRadius:18,
  alignItems:"center",
},

rewardButtonText:{
  color:"#004225",
  fontWeight:"900",
  fontSize:16,
},
coffeeButton: {
  marginTop: 18,
  backgroundColor: "#004225",
  paddingVertical: 16,
  borderRadius: 18,
  alignItems: "center",
},

coffeeButtonText: {
  color: "#fff4e3",
  fontWeight: "900",
  fontSize: 16,
},
});