import {
  ScrollView,
  StyleSheet,
} from "react-native";

import NotificationForm
from "../components/admin/NotificationForm";

export default function NotificationsScreen(){

return(

<ScrollView
style={styles.container}
contentContainerStyle={{
padding:20,
}}>

<NotificationForm/>

</ScrollView>

);

}

const styles=StyleSheet.create({

container:{
flex:1,
backgroundColor:"#F5F5F5",
},

});