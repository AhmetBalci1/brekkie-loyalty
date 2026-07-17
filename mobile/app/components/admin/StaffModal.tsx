import { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

type Props = {
  visible: boolean;
  editing: boolean;
  staff: any | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function StaffModal({
  visible,
  editing,
  staff,
  onClose,
  onSuccess,
}: Props) {

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
 const [role, setRole] = useState("cashier");

const [roleModalVisible, setRoleModalVisible] =
  useState(false);

  const [saving, setSaving] =
  useState(false);
  useEffect(() => {

  if (editing && staff) {

    setName(staff.name);
    setUsername(staff.username);
    setPassword("");
    setRole(staff.role);
  } else {

    setName("");
    setUsername("");
    setPassword("");
    setRole("cashier");
  }

}, [editing, staff, visible]);

  const saveStaff = async () => {
    if (!name.trim()) {
  Alert.alert(
    "Hata",
    "Ad Soyad zorunludur."
  );
  return;
}

if (!username.trim()) {
  Alert.alert(
    "Hata",
    "Kullanıcı adı zorunludur."
  );
  return;
}

if (!editing && !password.trim()) {
  Alert.alert(
    "Hata",
    "Şifre zorunludur."
  );
  return;
}

if (saving) return;
const url = editing
  ? `https://brekkie-api.onrender.com/staff/${staff.id}`
  : "https://brekkie-api.onrender.com/staff";

const method = editing ? "PUT" : "POST";

setSaving(true);
    try {

      const response = await fetch(url, {
  method,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  name,
  username,
  password,
  role,
}),
});
      const data = await response.json();

      if (!response.ok) {

        Alert.alert(
          "Hata",
          data.error
        );

        return;

      }

      setName("");
      setUsername("");
      setPassword("");
      setRole("cashier");
     Alert.alert(
  "Başarılı",
  editing
    ? "Personel güncellendi."
    : "Personel oluşturuldu."
);

onSuccess();

onClose();

    } catch {

  Alert.alert(
    "Hata",
    editing
      ? "Personel güncellenemedi."
      : "Personel oluşturulamadı."
  );

}
finally {

  setSaving(false);

}
  };

  return (

    <Modal
      visible={visible}
      animationType="slide"
      transparent
    >

      <View style={styles.overlay}>

        <View style={styles.modal}>

          <Text style={styles.title}>
  {editing
    ? "✏️ Personel Düzenle"
    : "👨‍🍳 Yeni Personel"}
</Text>

          <TextInput
            placeholder="Ad Soyad"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TextInput
            placeholder="Kullanıcı Adı"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />

          <TextInput
            placeholder={
  editing
    ? "Yeni şifre (boş bırakılabilir)"
    : "Şifre"
}
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
 />
<Text style={styles.label}>
  Rol
</Text>
<TouchableOpacity
  style={styles.roleButton}
  onPress={() =>
    setRoleModalVisible(true)
  }
>

  <Text style={styles.roleText}>

    {role === "admin"
      ? "👑 Admin"
      : "👨‍🍳 Kasiyer"}

  </Text>

</TouchableOpacity>

<Modal
  visible={roleModalVisible}
  transparent
  animationType="slide"
>

<View style={styles.roleOverlay}>

<View style={styles.roleModal}>

<Text style={styles.roleTitle}>
Rol Seç
</Text>

<TouchableOpacity
onPress={() => {

setRole("cashier");

setRoleModalVisible(false);

}}
>

<Text style={styles.roleItem}>
👨‍🍳 Kasiyer
</Text>

</TouchableOpacity>

<TouchableOpacity
onPress={() => {

setRole("admin");

setRoleModalVisible(false);

}}
>

<Text style={styles.roleItem}>
👑 Admin
</Text>

</TouchableOpacity>

<TouchableOpacity
onPress={() =>
setRoleModalVisible(false)
}
>

<Text style={styles.cancel}>
Vazgeç
</Text>

</TouchableOpacity>

</View>

</View>

</Modal>
         <TouchableOpacity
  style={styles.saveButton}
  onPress={saveStaff}
  disabled={saving}
>

           <Text style={styles.saveText}>
  {saving
    ? "Kaydediliyor..."
    : editing
    ? "Güncelle"
    : "Personeli Oluştur"}
    
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
backgroundColor:"rgba(0,0,0,0.22)", // Eski: 0.45
justifyContent:"center",
padding:20,
},

modal:{
backgroundColor:"#FFFFFF",
borderRadius:24,
padding:24,

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
borderRadius:16,
padding:14,
marginBottom:14,

backgroundColor:"#FDFBF8",

color:"#262626",
},

saveButton:{
backgroundColor:"#E8B07A", // Eski: #004225

padding:16,

borderRadius:16,

alignItems:"center",

shadowColor:"#E8B07A",
shadowOffset:{
  width:0,
  height:4,
},
shadowOpacity:0.20,
shadowRadius:8,
elevation:4,
},

saveText:{
color:"#262626", // Eski: white
fontWeight:"700",
fontSize:16,
},

cancel:{
marginTop:18,
textAlign:"center",
color:"#8A8178", // Eski: #888
fontWeight:"600",
},

label:{
fontWeight:"700",
marginBottom:8,
color:"#262626", // Eski: #555
},

roleButton:{
borderWidth:1,
borderColor:"#EADBC8", // Eski: #ddd

padding:16,

borderRadius:16,

marginBottom:16,

backgroundColor:"#FDFBF8",
},

roleText:{
fontSize:16,
color:"#262626", // Eski: #333
},

roleOverlay:{
flex:1,
justifyContent:"flex-end",
backgroundColor:"rgba(0,0,0,0.22)", // Eski: 0.35
},

roleModal:{
backgroundColor:"#FFFFFF",

padding:24,

borderTopLeftRadius:28,
borderTopRightRadius:28,

borderTopWidth:1,
borderLeftWidth:1,
borderRightWidth:1,
borderColor:"#EADBC8",
},

roleTitle:{
fontSize:22,
fontWeight:"800",
marginBottom:20,
color:"#262626", // Eski: #004225
textAlign:"center",
},

roleItem:{
fontSize:18,

paddingVertical:18,

textAlign:"center",

color:"#C97C4A", // Eski: #004225

fontWeight:"700",
},

});