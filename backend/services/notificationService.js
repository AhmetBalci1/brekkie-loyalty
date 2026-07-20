const { Expo } = require("expo-server-sdk");

const expo = new Expo();

async function sendNotification(
  pushToken,
  title,
  body,
  data = {}
) {

  if (!Expo.isExpoPushToken(pushToken)) {
    throw new Error("Geçersiz Push Token");
  }

  const messages = [
    {
      to: pushToken,
      sound: "default",
      title,
      body,
      data,
    },
  ];

  const chunks =
    expo.chunkPushNotifications(messages);

  for (const chunk of chunks) {

    await expo.sendPushNotificationsAsync(
      chunk
    );

  }

}

async function sendToMany(
  pushTokens,
  title,
  body
) {

  const messages = [];

  for (const token of pushTokens) {

    if (!Expo.isExpoPushToken(token))
      continue;

    messages.push({
      to: token,
      sound: "default",
      title,
      body,
    });

  }

  const chunks =
    expo.chunkPushNotifications(messages);

  for (const chunk of chunks) {

    await expo.sendPushNotificationsAsync(
      chunk
    );

  }
return messages;
}

module.exports = {
  sendNotification,
  sendToMany,
};