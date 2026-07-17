import { Tabs } from "expo-router";
import { Ionicons }
from "@expo/vector-icons";
export default function TabLayout() {
  return (

    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          backgroundColor: "#F8F5F0",

          borderTopWidth: 0,

          height: 75,

          borderTopColor:"rgba(212,175,55,0.15",
          borderWidth: 1,

          paddingBottom: 12,

          paddingTop: 10,
        },

        tabBarActiveTintColor:
          "#C97C4A",

        tabBarInactiveTintColor:
          "#8E8E8E",
      }}
    >

      <Tabs.Screen
        name="index"
        

        options={{
          title: "Home",

          tabBarIcon: ({
            color,
            size,
          }) => (
            <Ionicons
              name="home"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
    
  );
}