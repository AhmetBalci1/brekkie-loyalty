import { useEffect, useState } from "react";
import toast from "react-native-toast-message";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

type Props = {
  visible: boolean;
  campaign?: any | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function CampaignModal({
  visible,
  campaign,
  onClose,
  onSuccess,
}: Props) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
useEffect(() => {
  if (campaign) {
    setTitle(campaign.title);
    setDescription(campaign.description);
  } else {
    setTitle("");
    setDescription("");
  }
}, [campaign, visible]);
 async function saveCampaign() {

  if (!title.trim()) {
    toast.show({
      type: "error",
      text1: "Hata",
      text2: "Kampanya başlığı zorunludur.",
    });
    return;
  }

  if (!description.trim()) {
    toast.show({
      type: "error",
      text1: "Hata",
      text2: "Kampanya açıklaması zorunludur.",
    });
    return;
  }

  if (saving) return;

  const url = campaign
    ? `https://brekkie-api.onrender.com/campaigns/${campaign.id}`
    : "https://brekkie-api.onrender.com/campaigns";

  const method = campaign ? "PUT" : "POST";

  setSaving(true);

  try {

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        campaign_type: campaign?.campaign_type ?? "loyalty",
        reward_type: campaign?.reward_type ?? "free_coffee",
        reward_value: campaign?.reward_value ?? 1,
        trigger_value: campaign?.trigger_value ?? 10,
        is_active: campaign?.is_active ?? true,
      }),
    });

    if (!response.ok) {
      throw new Error();
    }

    

    toast.show({
      type: "success",
      text1: "Başarılı",
      text2: campaign
        ? "Kampanya güncellendi."
        : "Kampanya oluşturuldu.",
    });

    onSuccess();
    setTitle("");
    setDescription("");
    onClose();

  } catch (err) {

    console.log(err);

    toast.show({
      type: "error",
      text1: "Hata",
      text2: "İşlem başarısız.",
    });

  } finally {

    setSaving(false);

  }
}

  return (

    <Modal
      visible={visible}
      animationType="slide"
      transparent
    >

      <View style={styles.overlay}>

        <View style={styles.modal}>

         <Text style={styles.title}>
  {campaign ? "Kampanya Düzenle" : "Yeni Kampanya"}
</Text>

         <TextInput
  placeholder="Kampanya başlığını girin"
  placeholderTextColor="#888"
  value={title}
  onChangeText={setTitle}
  style={styles.input}
/>

          <TextInput
  placeholder="Kampanya açıklaması"
  placeholderTextColor="#888"
  value={description}
  onChangeText={setDescription}
  style={styles.input}
/>

         <TouchableOpacity
  style={styles.button}
  onPress={saveCampaign}
  disabled={saving}
>

 <Text style={styles.buttonText}>
  {saving
    ? "Kaydediliyor..."
    : campaign
    ? "Güncelle"
    : "Kaydet"}
</Text>

          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
          >

            <Text style={styles.cancel}>
              Vazgeç
            </Text>

          </TouchableOpacity>

        </View>

      </View>

    </Modal>

  );

}

const styles = StyleSheet.create({

  overlay:{
    flex:1,
    backgroundColor:"rgba(0,0,0,0.22)", // Eski: 0.4
    justifyContent:"center",
    padding:20,
  },

  modal:{
    backgroundColor:"#FFFFFF",
    borderRadius:24,
    padding:22,

    borderWidth:1,
    borderColor:"#EADBC8",

    shadowColor:"#000",
    shadowOffset:{
      width:0,
      height:6,
    },
    shadowOpacity:0.08,
    shadowRadius:12,
    elevation:5,
  },

  title:{
    fontSize:24,
    fontWeight:"800",
    color:"#262626", // Eski: #004225
    marginBottom:20,
  },

  input:{
    borderWidth:1,
    borderColor:"#EADBC8", // Eski: #ddd
    borderRadius:14,
    padding:14,
    marginBottom:14,

    backgroundColor:"#FDFBF8",
    color:"#262626",
  },

  button:{
    backgroundColor:"#E8B07A", // Eski: #004225
    padding:16,
    borderRadius:14,
    alignItems:"center",
    marginTop:10,

    shadowColor:"#E8B07A",
    shadowOffset:{
      width:0,
      height:4,
    },
    shadowOpacity:0.20,
    shadowRadius:8,
    elevation:4,
  },

  buttonText:{
    color:"#262626", // Eski: white
    fontWeight:"700",
    fontSize:16,
  },

  cancel:{
    marginTop:18,
    textAlign:"center",
    color:"#8A8178", // Eski: #666
    fontWeight:"600",
  }

});