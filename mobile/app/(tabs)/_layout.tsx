import { Tabs } from "expo-router";
import { Ionicons }
from "@expo/vector-icons";
export default function TabLayout() {

  return (

    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          backgroundColor: "#004225",

          borderTopWidth: 0,

          height: 85,

          paddingBottom: 12,

          paddingTop: 10,
        },

        tabBarActiveTintColor:
          "#d4af37",

        tabBarInactiveTintColor:
          "#fff4e3",
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