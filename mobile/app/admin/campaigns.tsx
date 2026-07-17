import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import CampaignList from "../components/admin/CampaignList";
import CampaignModal from "../components/admin/CampaignModal";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";


export default function CampaignsScreen() {
  const [selectedCampaign, setSelectedCampaign] =
  useState<any | null>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
const [loading, setLoading] = useState(true);

const [modalVisible, setModalVisible] =
  useState(false);

const loadCampaigns = () => {

  setLoading(true);

  fetch("https://brekkie-api.onrender.com/campaigns")
    .then((res) => res.json())
    .then((data) => {

      setCampaigns(data);

    })
    .catch(console.log)
    .finally(() => {

      setLoading(false);

    });

};
const deleteCampaign = (campaign: any) => {
  Alert.alert(
    "Kampanyayı Sil",
    `"${campaign.title}" kampanyasını silmek istediğine emin misin?`,
    [
      {
        text: "Vazgeç",
        style: "cancel",
      },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await fetch(
              `https://brekkie-api.onrender.com/campaigns/${campaign.id}`,
              {
                method: "DELETE",
              }
            );

            if (!response.ok) {
              throw new Error();
            }

            Toast.show({
              type: "success",
              text1: "Başarılı",
              text2: "Kampanya silindi.",
            });

            loadCampaigns();

          } catch (err) {
            Toast.show({
              type: "error",
              text1: "Hata",
              text2: "Kampanya silinemedi.",
            });
          }
        },
      },
    ]
  );
};
const handleToggle = async (campaign: any) => {
  try {
    await fetch(
      `https://brekkie-api.onrender.com/campaigns/${campaign.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...campaign,
          is_active: !campaign.is_active,
        }),
      }
    );

    loadCampaigns();

  } catch (err) {
    console.log(err);
  }
};
const handleEdit = (campaign: any) => {
  setSelectedCampaign(campaign);
  setModalVisible(true);
};
useEffect(() => {

  loadCampaigns();

}, []);
 
  return (
    <>
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 20 }}
    >

      <Text style={styles.title}>
        🎁 Campaign Center
      </Text>

      <TouchableOpacity
  style={styles.addButton}
  onPress={() => setModalVisible(true)}
>
        <Text style={styles.addButtonText}>
          + Yeni Kampanya
        </Text>
      </TouchableOpacity>

<CampaignList
  campaigns={campaigns}
  loading={loading}
  onToggle={handleToggle}
  onEdit={handleEdit}
  onDelete={deleteCampaign}
/>

    </ScrollView>
 <CampaignModal
  visible={modalVisible}
  campaign={selectedCampaign}
  onClose={() => {
    setModalVisible(false);
    setSelectedCampaign(null);
  }}
  onSuccess={() => {
    loadCampaigns();
    setSelectedCampaign(null);
  }}
/>
</>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#004225",
    marginBottom: 20,
  },

  addButton: {
    backgroundColor: "#004225",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 24,
  },

  addButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});