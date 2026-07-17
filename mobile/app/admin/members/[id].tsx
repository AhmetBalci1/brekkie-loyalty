import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

type Member = {
  id: number;
  name: string;
  email: string;
  coffee_count: number;
  free_coffee: number;
  qr_code: string;
};

export default function MemberDetail() {
  const { id } = useLocalSearchParams();

  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://brekkie-api.onrender.com/users/${id}`)
      .then((res) => res.json())
      .then((data) => setMember(data))
      .catch(console.log)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#004225" />
      </View>
    );
  }

  if (!member) {
    return (
      <View style={styles.center}>
        <Text>Kullanıcı bulunamadı.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>👤 {member.name}</Text>

      <Text style={styles.info}>
        📧 {member.email}
      </Text>

      <Text style={styles.info}>
        ☕ {member.coffee_count} / 10 Kahve
      </Text>

      <Text style={styles.info}>
        🎁 {member.free_coffee} Ücretsiz Kahve
      </Text>

      <Text style={styles.info}>
        🔳 QR: {member.qr_code}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F5F5F5",
  },

  name: {
    fontSize: 28,
    fontWeight: "800",
    color: "#004225",
    marginBottom: 24,
  },

  info: {
    fontSize: 18,
    marginBottom: 16,
    color: "#444",
  },
});