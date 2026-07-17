const API_URL = "https://brekkie-api.onrender.com";

export async function getStores() {

  const response = await fetch(
    `${API_URL}/stores`
  );

  const result = await response.json();

  if (!result.success) {
    throw new Error("Şubeler alınamadı");
  }

  return result.stores;
}