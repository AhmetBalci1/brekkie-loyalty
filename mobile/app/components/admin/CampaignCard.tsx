import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

type Props = {
  campaign: any;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function CampaignCard({
  campaign,
  onToggle,
  onEdit,
  onDelete,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {campaign.title}
        </Text>

        <View
          style={[
            styles.badge,
            {
              backgroundColor: campaign.is_active
                ? "#DDF5E5"
                : "#F8D7DA",
            },
          ]}
        >
          <Text
            style={{
              color: campaign.is_active
                ? "#1F8A4C"
                : "#B02A37",
              fontWeight: "700",
            }}
          >
            {campaign.is_active ? "Aktif" : "Pasif"}
          </Text>
        </View>
      </View>

      <Text style={styles.description}>
        {campaign.description}
      </Text>
      <TouchableOpacity
  onPress={onEdit}
  style={styles.editButton}
>
  <Text style={styles.editButtonText}>
    Düzenle
  </Text>
</TouchableOpacity>
      <TouchableOpacity
  onPress={onToggle}
  style={[
    styles.toggleButton,
    {
      backgroundColor: campaign.is_active
        ? "#B02A37"
        : "#1F8A4C",
    },
  ]}
>
  <Text style={styles.toggleButtonText}>
    {campaign.is_active
      ? "Pasif Yap"
      : "Aktif Yap"}
  </Text>
  
</TouchableOpacity>
<TouchableOpacity
  onPress={onDelete}
  style={styles.deleteButton}
>
  <Text style={styles.deleteButtonText}>
    Sil
  </Text>
</TouchableOpacity>
    </View>
    
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#004225",
  },

  description: {
    marginTop: 10,
    color: "#666",
    lineHeight: 20,
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  toggleButton: {
  marginTop: 16,
  borderRadius: 12,
  paddingVertical: 12,
  alignItems: "center",
},

toggleButtonText: {
  color: "#fff",
  fontWeight: "700",
  fontSize: 15,
},
editButton: {
  marginTop: 16,
  backgroundColor: "#004225",
  borderRadius: 12,
  paddingVertical: 12,
  alignItems: "center",
},

editButtonText: {
  color: "#fff",
  fontWeight: "700",
  fontSize: 15,
  textAlign: "center",
},
deleteButton: {
  marginTop: 12,
  backgroundColor: "#D64545",
  borderRadius: 12,
  paddingVertical: 12,
  alignItems: "center",
},

deleteButtonText: {
  color: "#fff",
  fontWeight: "700",
  fontSize: 15,
},
});