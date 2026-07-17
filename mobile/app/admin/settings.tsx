import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import SettingsBusiness from "../components/admin/SettingsBusiness";
import SettingsLoyalty from "../components/admin/SettingsLoyalty";
import SettingsSecurity from "../components/admin/SettingsSecurity";
import SettingsNotifications from "../components/admin/SettingsNotifications";
import SettingsAppInfo from "../components/admin/SettingsAppInfo";

export default function SettingsScreen() {

  const [businessName, setBusinessName] =
    useState("");

  const [loyaltyTarget, setLoyaltyTarget] =
    useState("");

  const [rewardType, setRewardType] =
    useState("");

  const [adminUsername, setAdminUsername] =
    useState("");

  const [adminPassword, setAdminPassword] =
    useState("");

  useEffect(() => {

    fetch(
      "https://brekkie-api.onrender.com/settings"
    )
      .then((res) => res.json())
      .then((data) => {

        setBusinessName(data.business_name);

        setLoyaltyTarget(
          data.loyalty_target.toString()
        );

        setRewardType(data.reward_type);

        setAdminUsername(
          data.admin_username
        );

        setAdminPassword(
          data.admin_password
        );

      })
      .catch(console.log);

  }, []);
  async function saveSettings() {

  try {

    const response = await fetch(
      "https://brekkie-api.onrender.com/settings",
      {

        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({

          business_name: businessName,

          loyalty_target: Number(
            loyaltyTarget
          ),

          reward_type: rewardType,

          admin_username:
            adminUsername,

          admin_password:
            adminPassword,

        }),

      }
    );

    if (!response.ok) {

      throw new Error();

    }

    Alert.alert(
      "Başarılı",
      "Ayarlar kaydedildi."
    );

  } catch {

    Alert.alert(
      "Hata",
      "Kaydedilemedi."
    );

  }

}

  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        padding:20,
      }}
    >

      <SettingsBusiness

        businessName={businessName}

        setBusinessName={setBusinessName}

      />

      <SettingsLoyalty

        loyaltyTarget={loyaltyTarget}

        setLoyaltyTarget={setLoyaltyTarget}

        rewardType={rewardType}

        setRewardType={setRewardType}

      />
<SettingsNotifications />
     <SettingsSecurity
  adminUsername={adminUsername}
  setAdminUsername={setAdminUsername}

  adminPassword={adminPassword}
  setAdminPassword={setAdminPassword}
/>

<TouchableOpacity
  style={styles.saveButton}
  onPress={saveSettings}
>

  <Text style={styles.saveButtonText}>
    Ayarları Kaydet
  </Text>

</TouchableOpacity>
<SettingsAppInfo />
    </ScrollView>

  );

}

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:"#F8F5F0", // Eski: #F5F5F5
},

saveButton: {

  backgroundColor:"#E8B07A", // Eski: #004225

  padding:18,

  borderRadius:16,

  alignItems:"center",

  marginTop:10,

  marginBottom:40,

  shadowColor:"#E8B07A",

  shadowOffset:{
    width:0,
    height:4,
  },

  shadowOpacity:0.20,

  shadowRadius:8,

  elevation:4,

},

saveButtonText:{

  color:"#262626", // Eski: #fff

  fontSize:17,

  fontWeight:"700",

},

});