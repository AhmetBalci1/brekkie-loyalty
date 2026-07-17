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
    backgroundColor:"#0b5d38",
    borderRadius:28,
    padding:20,
    marginBottom:18,
  },

  title:{
    color:"#d4af37",
    fontSize:20,
    fontWeight:"900",
    marginBottom:16,
  },

  scroll:{
    maxHeight:190,
  },

  item:{
    borderBottomWidth:1,
    borderBottomColor:"rgba(255,255,255,.08)",
    paddingVertical:12,
  },

  name:{
    color:"white",
    fontSize:16,
    fontWeight:"700",
  },

  action:{
    color:"#d4af37",
    marginTop:4,
  },

  empty:{
    color:"#ddd",
  },

});