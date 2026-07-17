import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

type Props = {
  onPress: () => void;
};

export default function ScanCard({
  onPress,
}: Props) {

  return (

    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={onPress}
    >

      <Text style={styles.icon}>
        📷
      </Text>

      <Text style={styles.title}>
        QR TARA
      </Text>

      <Text style={styles.subtitle}>
        Müşteri QR kodunu okutmak için dokunun
      </Text>

    </TouchableOpacity>

  );

}

const styles = StyleSheet.create({

  card:{
    backgroundColor:"#d4af37",
    borderRadius:30,
    paddingVertical:34,
    alignItems:"center",
    justifyContent:"center",
    marginBottom:20,

    shadowColor:"#000",
    shadowOffset:{
      width:0,
      height:8,
    },
    shadowOpacity:0.22,
    shadowRadius:12,
    elevation:10,
  },

  icon:{
    fontSize:52,
  },

  title:{
    marginTop:12,
    color:"#004225",
    fontSize:30,
    fontWeight:"900",
    letterSpacing:1,
  },

  subtitle:{
    marginTop:8,
    color:"#2b2b2b",
    fontSize:15,
    textAlign:"center",
    paddingHorizontal:30,
  },

});