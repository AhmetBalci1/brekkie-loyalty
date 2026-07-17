import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";

import { useEffect, useState } from "react";
import StaffModal from "../components/admin/StaffModal";

export default function StaffScreen() {

  const [staff, setStaff] =
    useState<any[]>([]);
    const [selectedStaff, setSelectedStaff] =
  useState<any>(null);

const [editing, setEditing] =
  useState(false);
    const [modalVisible, setModalVisible] =
  useState(false);

  const loadStaff = () => {

  fetch(
    "https://brekkie-api.onrender.com/staff"
  )
    .then((res) => res.json())
    .then((data) => {

      setStaff(data);

    })
    .catch(console.log);

};

useEffect(() => {

  loadStaff();

}, []);

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
         Personeller
      </Text>
<TouchableOpacity
  style={styles.addButton}
  onPress={() => setModalVisible(true)}
>

  <Text style={styles.addButtonText}>
    + Yeni Personel
  </Text>
  

</TouchableOpacity>
      <FlatList

        data={staff}

        keyExtractor={(item)=>
          item.id.toString()
        }

        renderItem={({item})=>(

          <View style={styles.card}>

            <Text style={styles.name}>
              {item.name}
            </Text>

            <Text style={styles.username}>
              @{item.username}
            </Text>

            <Text style={styles.role}>
              {item.role}
            </Text>
<Text
  style={{
    marginTop: 6,
    fontWeight: "700",
    color: item.active ? "#1F8A4C" : "#B02A37",
  }}
>
  {item.active ? "🟢 Aktif" : "🔴 Pasif"}
  
</Text>
<TouchableOpacity
  style={styles.statusButton}
  onPress={async () => {

    try {

      await fetch(
        `https://brekkie-api.onrender.com/staff/${item.id}/status`,
        {
          method: "PATCH",
        }
      );

      loadStaff();

    } catch (err) {

      console.log(err);

    }

  }}
>

  <Text style={styles.statusButtonText}>

    {item.active
      ? "🚫 Pasif Yap"
      : "✅ Aktif Et"}

  </Text>

</TouchableOpacity>
<TouchableOpacity
  style={styles.editButton}
  onPress={() => {

    setSelectedStaff(item);

    setEditing(true);

    setModalVisible(true);

  }}
>

<Text style={styles.editButtonText}>
✏️ Düzenle
</Text>

</TouchableOpacity>
<TouchableOpacity
  style={styles.deleteButton}
  onPress={async () => {

    Alert.alert(
      "Personeli Sil",
      `${item.name} silinsin mi?`,
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

              await fetch(
                `https://brekkie-api.onrender.com/staff/${item.id}`,
                {
                  method: "DELETE",
                }
              );

              loadStaff();

            } catch (err) {

              console.log(err);

            }

          },
        },
      ]
    );

  }}
>

  <Text style={styles.deleteButtonText}>
    🗑 Personeli Sil
  </Text>

</TouchableOpacity>
          </View>

        )}

      />
<StaffModal
  visible={modalVisible}
  editing={editing}
  staff={selectedStaff}
  onClose={() => {
    setModalVisible(false);
    setEditing(false);
    setSelectedStaff(null);
  }}
  onSuccess={loadStaff}
/>
    </View>

  );

}

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:"#F8F5F0", // Eski: #F5F5F5
padding:20,
},

title:{
fontSize:28,
fontWeight:"900",
color:"#262626", // Eski: #004225
marginBottom:20,
},

card:{
backgroundColor:"#FFFFFF",
padding:20,
borderRadius:18,
marginBottom:16,

borderWidth:1,
borderColor:"#EADBC8",

shadowColor:"#000",
shadowOffset:{
  width:0,
  height:4,
},
shadowOpacity:0.05,
shadowRadius:8,
elevation:3,
},

name:{
fontSize:18,
fontWeight:"800",
color:"#262626", // Eski: #004225
},

username:{
marginTop:6,
color:"#8A8178", // Eski: #666
},

role:{
marginTop:8,
fontWeight:"700",
color:"#C97C4A", // Eski: #d4af37
},

addButton:{
backgroundColor:"#E8B07A", // Eski: #004225
paddingVertical:16,
borderRadius:18,
alignItems:"center",
marginBottom:20,

shadowColor:"#E8B07A",
shadowOffset:{
  width:0,
  height:4,
},
shadowOpacity:0.20,
shadowRadius:8,
elevation:4,
},

addButtonText:{
color:"#262626", // Eski: #fff
fontSize:17,
fontWeight:"700",
},

statusButton:{
marginTop:14,
backgroundColor:"#DCC8B4", // Eski: #004225
paddingVertical:10,
borderRadius:12,
alignItems:"center",
},

statusButtonText:{
color:"#262626", // Eski: white
fontWeight:"700",
},

editButton:{

marginTop:10,

backgroundColor:"#E8B07A", // Eski: #d4af37

paddingVertical:10,

borderRadius:12,

alignItems:"center",

},

editButtonText:{

color:"#262626", // Eski: #004225

fontWeight:"800",

},
deleteButton:{
  marginTop:10,

  backgroundColor:"#D9534F",

  paddingVertical:10,

  borderRadius:12,

  alignItems:"center",
},

deleteButtonText:{
  color:"#FFFFFF",

  fontWeight:"800",
},
});