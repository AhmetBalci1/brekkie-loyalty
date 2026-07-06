import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function MemberDetail() {

  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Member Detail
      </Text>

      <Text style={styles.id}>
        Member ID: {id}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#F5F5F5"
  },

  title:{
    fontSize:28,
    fontWeight:"800",
    color:"#004225",
    marginBottom:20,
  },

  id:{
    fontSize:18,
    color:"#666",
  }
});