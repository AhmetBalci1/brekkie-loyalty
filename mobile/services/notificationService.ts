import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function registerForPushNotifications() {

  if (!Device.isDevice) {

    alert("Gerçek bir cihaz kullanmalısın.");

    return null;

  }

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {

    const { status } =
      await Notifications.requestPermissionsAsync();

    finalStatus = status;

  }

  if (finalStatus !== "granted") {

    alert("Bildirim izni verilmedi.");

    return null;

  }

  const projectId =
  Constants.easConfig?.projectId ??
  Constants.expoConfig?.extra?.eas?.projectId;

  const token =
    await Notifications.getExpoPushTokenAsync({

      projectId,

    });

  console.log("Push Token:", token.data);
  const savedUser =
  await AsyncStorage.getItem("user");

if (savedUser) {

  const user =
    JSON.parse(savedUser);

  await fetch(
    "https://brekkie-api.onrender.com/users/push-token",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({

        userId: user.id,

        pushToken: token.data,

      }),

    }
  );

  console.log(
    "✅ Push Token kaydedildi."
  );

}

  return token.data;

}