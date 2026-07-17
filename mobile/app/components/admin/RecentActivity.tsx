import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

type Activity = {
  id: number;
  name: string;
  reward_earned: boolean;
  created_at: string;
};

export default function RecentActivity() {

  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {

    fetch("https://brekkie-api.onrender.com/recent-scans")
      .then((res) => res.json())
      .then((data) => setActivities(data))
      .catch(console.log);

  }, []);

  return (

    <View style={styles.card}>

      <Text style={styles.title}>
        Son Aktiviteler
      </Text>

      {activities.length === 0 ? (

        <Text style={styles.empty}>
          Henüz aktivite yok.
        </Text>

      ) : (

        activities.map((activity) => (

          <View
            key={activity.id}
            style={styles.item}
          >

            <Text style={styles.name}>
              👤 {activity.name}
            </Text>

            <Text style={styles.detail}>
              {activity.reward_earned
                ? "🎁 Ücretsiz kahve kazandı"
                : "☕ QR tarattı"}
            </Text>

          </View>

        ))

      )}

    </View>

  );

}

const styles = StyleSheet.create({

  card:{
    backgroundColor:"#004225",
    borderRadius:24,
    padding:20,
    marginTop:20,
  },

  title:{
    color:"#d4af37",
    fontSize:20,
    fontWeight:"800",
    marginBottom:18,
  },

  item:{
    marginBottom:16,
    borderBottomWidth:1,
    borderBottomColor:"rgba(255,255,255,.1)",
    paddingBottom:12,
  },

  name:{
    color:"white",
    fontSize:16,
    fontWeight:"700",
  },

  detail:{
    color:"#ddd",
    marginTop:4,
  },

  empty:{
    color:"#ddd",
  }

});