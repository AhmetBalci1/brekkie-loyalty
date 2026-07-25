function getRandomMessage(messages) {
  return messages[
    Math.floor(Math.random() * messages.length)
  ];
}
function getRandomTitle(titles) {
  return titles[
    Math.floor(Math.random() * titles.length)
  ];
}

const oneCoffeeLeft = (name, current, target) => ({
  title: getRandomTitle([
    "☕ Bir Kahve Kaldı!",
    "☕ Bir Adım Kaldı!",
    "🎉 Harika Gidiyorsun!",
    "🔥 Neredeyse Tamam!",
    "🎁 Sürprize Çok Az Kaldı!",
  ]),

  body: getRandomMessage([
    `${name}, harika gidiyorsun! ☕ ${current}/${target} kahveni tamamladın. Son bir kahve kaldı!`,
    `Bir sonraki kahve ücretsiz ${name}! 🎉`,
    `Ödüle çok yaklaştın! Son bir kahve seni bekliyor. ☕`,
    `${name}, ücretsiz kahvene sadece bir kahve kaldı! ❤️`,
    `Kahve kartın dolmak üzere. Son bir adım! ☕`,
    `Harika! Bir sonraki ziyaretinde ücretsiz kahveni kazanabilirsin. 🎁`,
    `${current}/${target} tamamlandı. Devam et ${name}! 🚀`,
    `Bir kahve sonra sürprizin hazır olacak. ☕✨`,
  ]),
});

const rewardEarned = (name) => ({
  title: getRandomTitle([
    "🎉 Tebrikler!",
    "☕ Bu Kahve Bizden!",
    "🎁 Ödülün Hazır!",
    "👏 Harika İş!",
    "⭐ Kazandın!",
  ]),

  body: getRandomMessage([
    `🎉 Tebrikler ${name}! Ücretsiz kahven hesabına tanımlandı.`,
    `${name}, bu kahve bizden! ☕`,
    `Sadakatin ödüllendirildi ❤️ Ücretsiz kahven hazır.`,
    `Harika iş ${name}! Yeni ödülün seni bekliyor.`,
    `Kahve kartın doldu! Afiyet olsun ☕`,
    `${name}, ücretsiz kahveni dilediğin zaman kullanabilirsin.`,
    `Bugünün en güzel haberi 🎉 Ücretsiz kahven hazır.`,
    `Bir ödül daha kazandın ${name}! Seni bekliyoruz ☕`,
  ]),
});

module.exports = {
  oneCoffeeLeft,
  rewardEarned,
};