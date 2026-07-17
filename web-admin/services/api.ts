import { Store } from "../types/store";
const API_URL = "https://brekkie-api.onrender.com";

export async function getStores(): Promise<Store[]> {
  const response = await fetch(`${API_URL}/stores`);

  console.log("STATUS:", response.status);

  const data = await response.json();

  console.log("DATA:", data);

  return data.stores;
}
export async function updateStore(
  id: number,
  store: Store
) {
  const response = await fetch(
    `${API_URL}/stores/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(store),
    }
  );

  return await response.json();
}
export async function createStore(
  store: Omit<Store, "id" | "created_at">
) {
  const response = await fetch(`${API_URL}/stores`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(store),
  });

  return await response.json();
}
export async function deleteStore(id: number) {
  const response = await fetch(`${API_URL}/stores/${id}`, {
    method: "DELETE",
  });

  return await response.json();
}