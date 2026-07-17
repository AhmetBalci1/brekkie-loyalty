import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

type Props = {
  history: any[];
};

export default function HistoryCard({
  history,
}: Props) {

  return (

    <View style={styles.card}>

      <Text style={styles.title}>
        🕒 Son İşlemler
      </Text>

      <ScrollView
        style={styles.scroll}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
      >

        {history.length === 0 ? (

          <Text style={styles.empty}>
            Henüz işlem yapılmadı.
          </Text>

        ) : (

          history.map((item) => (

            <View
              key={item.id}
              style={styles.item}
            >

              <View>

                <Text style={styles.name}>
                  👤 {item.name}
                </Text>

                <Text style={styles.action}>
                  {item.reward_earned
                    ? "🎁 Ücretsiz Kahve"
                    : "☕ +1 Kahve"}
                </Text>

              </View>

            </View>

          ))

        )}

      </ScrollView>

    </View>

  );

}

const styles = StyleSheet.create({

  card:{
    width:"100%",

    backgroundColor:"#FFFFFF",      // Eski: #0b5d38

    borderRadius:28,

    padding:20,

    marginBottom:18,

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
    color:"#262626",                // Eski: #d4af37

    fontSize:20,

    fontWeight:"900",

    marginBottom:16,
  },

  scroll:{
    maxHeight:190,
  },

  item:{
    borderBottomWidth:1,

    borderBottomColor:"#F0E6DA",    // Eski: rgba(255,255,255,.08)

    paddingVertical:12,
  },

  name:{
    color:"#262626",                // Eski: white

    fontSize:16,

    fontWeight:"700",
  },

  action:{
    color:"#C97C4A",                // Eski: #d4af37

    marginTop:4,

    fontWeight:"600",
  },

  empty:{
    color:"#8A8178",                // Eski: #ddd
  },

});