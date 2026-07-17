import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
  backgroundColor: "#EADBC8",
},

headerTintColor: "#262626",

headerTitleStyle: {
  fontWeight: "700",
  color: "#262626",
},

contentStyle: {
  backgroundColor: "#F8F5F0",
},
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Dashboard",
        }}
      />

      <Stack.Screen
        name="members"
        options={{
          title: "Members",
        }}
      />

      <Stack.Screen
        name="campaigns"
        options={{
          title: "Campaigns",
        }}
      />

      <Stack.Screen
        name="notifications"
        options={{
          title: "Notifications",
        }}
      />

      <Stack.Screen
        name="settings"
        options={{
          title: "Settings",
        }}
      />
    </Stack>
  );
}