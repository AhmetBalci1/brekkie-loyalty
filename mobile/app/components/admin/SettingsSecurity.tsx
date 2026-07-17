import { View, Text, TextInput, StyleSheet } from "react-native";

type Props = {

adminUsername:string;
setAdminUsername:(v:string)=>void;

adminPassword:string;
setAdminPassword:(v:string)=>void;


};

export default function SettingsSecurity({

adminUsername,
setAdminUsername,

adminPassword,
setAdminPassword,


}:Props){

return(

<View style={styles.card}>

<Text style={styles.title}>
🔒 Güvenlik
</Text>

<Text style={styles.label}>
Admin Kullanıcı Adı
</Text>

<TextInput
value={adminUsername}
onChangeText={setAdminUsername}
style={styles.input}
/>

<Text style={styles.label}>
Admin Şifre
</Text>

<TextInput
secureTextEntry
value={adminPassword}
onChangeText={setAdminPassword}
style={styles.input}
/>

</View>

);

}

const styles=StyleSheet.create({

card:{
backgroundColor:"#fff",
padding:20,
borderRadius:20,
elevation:4,
},

title:{
fontSize:22,
fontWeight:"800",
color:"#004225",
marginBottom:20,
},

label:{
fontWeight:"700",
marginBottom:8,
color:"#555",
},

input:{
borderWidth:1,
borderColor:"#ddd",
padding:14,
borderRadius:12,
marginBottom:16,
backgroundColor:"#fff",
color:"#222",
},

});