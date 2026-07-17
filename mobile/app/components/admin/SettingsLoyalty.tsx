import { View, Text, TextInput, StyleSheet } from "react-native";

type Props = {
  loyaltyTarget: string;
  setLoyaltyTarget: (value: string) => void;

  rewardType: string;
  setRewardType: (value: string) => void;
};

export default function SettingsLoyalty({
  loyaltyTarget,
  setLoyaltyTarget,
  rewardType,
  setRewardType,
}: Props) {

  return (
    <View style={styles.card}>

      <Text style={styles.title}>
        ☕ Sadakat Sistemi
      </Text>

      <Text style={styles.label}>
        Kaç Kahvede Ödül?
      </Text>

      <TextInput
        value={loyaltyTarget}
        onChangeText={setLoyaltyTarget}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>
        Ödül Türü
      </Text>

      <TextInput
        value={rewardType}
        onChangeText={setRewardType}
        style={styles.input}
      />

    </View>
  );

}

const styles = StyleSheet.create({

card:{
backgroundColor:"#fff",
padding:20,
borderRadius:20,
marginBottom:20,
elevation:4,
},

title:{
fontSize:22,
fontWeight:"800",
color:"#004225",
marginBottom:20,
},

label:{
fontWeight:"700",
marginBottom:8,
color:"#555",
},

input:{
borderWidth:1,
borderColor:"#ddd",
padding:14,
borderRadius:12,
marginBottom:16,
backgroundColor:"#fff",
color:"#222",
},

});