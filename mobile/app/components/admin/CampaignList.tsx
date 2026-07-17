import React from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
  StyleSheet,
  Text,
} from "react-native";

import CampaignCard from "./CampaignCard";
type Props = {
  campaigns: any[];
  loading: boolean;
  onToggle: (campaign: any) => void;
  onEdit: (campaign: any) => void;
  onDelete: (campaign: any) => void;
};

export default function CampaignList({
  campaigns,
  loading,
  onToggle,
  onEdit,
  onDelete,
}: Props) {



  if (loading) {

    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#004225"
        />
      </View>
    );

  }
  if (!campaigns.length) {
  return (
    <View style={styles.center}>

      <Text style={styles.emptyEmoji}>
        🎁
      </Text>

      <Text style={styles.emptyTitle}>
        Henüz kampanya yok
      </Text>

      <Text style={styles.emptyDescription}>
        İlk kampanyanı oluşturmak için
        yukarıdaki butonu kullan.
      </Text>

    </View>
  );
}

  return (

    <FlatList

      data={campaigns}

      keyExtractor={(item) =>
        item.id.toString()
      }

      renderItem={({ item }) => (

<CampaignCard
  campaign={item}
  onToggle={() => onToggle(item)}
  onEdit={() => onEdit(item)}
  onDelete={() => onDelete(item)}
/>

      )}

      scrollEnabled={false}

    />

  );

}

const styles = StyleSheet.create({

  center: {

    paddingVertical: 40,

    alignItems: "center",

  },
emptyEmoji: {
  fontSize: 60,
  marginBottom: 20,
},

emptyTitle: {
  fontSize: 20,
  fontWeight: "700",
  color: "#004225",
},

emptyDescription: {
  marginTop: 10,
  color: "#666",
  textAlign: "center",
  lineHeight: 22,
},
});