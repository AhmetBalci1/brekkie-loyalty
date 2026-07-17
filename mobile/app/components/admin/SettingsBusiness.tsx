import { View, Text, TextInput, StyleSheet } from "react-native";

type Props = {
  businessName: string;
  setBusinessName: (value: string) => void;
};

export default function SettingsBusiness({
  businessName,
  setBusinessName,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        🏪 İşletme Bilgileri
      </Text>

      <Text style={styles.label}>
        İşletme Adı
      </Text>

      <TextInput
        value={businessName}
        onChangeText={setBusinessName}
        placeholder="İşletme Adı"
        placeholderTextColor="#888"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#004225",
    marginBottom: 20,
  },

  label: {
    color: "#555",
    marginBottom: 8,
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
    padding: 14,
    backgroundColor: "#fff",
    color: "#222",
  },
});