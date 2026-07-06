import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
 Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from "react-native";

type Member = {
  id: number;
  name: string;
  coffee_count: number;
  free_coffee: number;
};


export default function MembersScreen() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("https://brekkie-api.onrender.com/users")
      .then((res) => res.json())
      .then((data) => {
        setMembers(data);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#004225" />
      </View>
    );
  }
 const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <FlatList
      data={filteredMembers}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={
  <TextInput
  placeholder="🔍 Üye ara..."
  placeholderTextColor="#888"
  value={search}
  onChangeText={setSearch}
  style={styles.searchInput}
/>
}
      contentContainerStyle={styles.container}
    renderItem={({ item }) => (
  <View style={styles.card}>

    <View style={styles.cardHeader}>
      <Text style={styles.name}>
        👤 {item.name}
      </Text>

      <View style={styles.activeBadge}>
        <Text style={styles.activeText}>
          Aktif
        </Text>
      </View>
    </View>

    <Text style={styles.info}>
      ☕ {item.coffee_count} / 10 Kahve
    </Text>

    <Text style={styles.info}>
      🎁 {item.free_coffee} Ücretsiz Kahve
    </Text>

    <TouchableOpacity
    style={styles.detailButton}
    onPress={() =>
        router.push(`../admin/members/${item.id}`)
    }
>
      <Text style={styles.detailText}>
        Detay →
      </Text>
    </TouchableOpacity>

  </View>
)}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    padding: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#004225",
    marginBottom: 8,
  },

  info: {
    fontSize: 15,
    color: "#555",
    marginTop: 4,
  },
  searchInput: {
  backgroundColor: "#fff",
  borderRadius: 16,
  paddingHorizontal: 18,
  paddingVertical: 14,
  marginBottom: 20,
  fontSize: 16,
  borderWidth: 1,
  borderColor: "#ddd",
},
cardHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 14,
},

activeBadge: {
  backgroundColor: "#DDF5E5",
  paddingHorizontal: 12,
  paddingVertical: 5,
  borderRadius: 20,
},

activeText: {
  color: "#1F8A4C",
  fontWeight: "700",
  fontSize: 13,
},

detailButton: {
  alignSelf: "flex-end",
  marginTop: 18,
},

detailText: {
  color: "#004225",
  fontWeight: "700",
  fontSize: 15,
},
});