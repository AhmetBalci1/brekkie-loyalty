import { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";

type Product = {
  id: number;
  name: string;
  temperature: string;
  price: string;
  category: string;
  loyalty_value: number;
  is_active: boolean;
};

export default function ProductsScreen() {

  const [products, setProducts] =
    useState<Product[]>([]);
    const [editVisible, setEditVisible] = useState(false);

const [selectedProduct, setSelectedProduct] =
  useState<Product | null>(null);

const [editName, setEditName] = useState("");
const [editCategory, setEditCategory] = useState("");
const [editTemperature, setEditTemperature] = useState("");
const [editPrice, setEditPrice] = useState("");
const [editLoyaltyValue, setEditLoyaltyValue] = useState("1");
const [addVisible, setAddVisible] =
  useState(false);

const [newName, setNewName] =
  useState("");

const [newCategory, setNewCategory] =
  useState("Coffee");

const [newTemperature, setNewTemperature] =
  useState("Hot");

const [newPrice, setNewPrice] =
  useState("");

const [newLoyaltyValue, setNewLoyaltyValue] =
  useState("1");

  const loadProducts = async () => {

  try {

    const response =
      await fetch(
        "https://brekkie-api.onrender.com/products"
      );

    const data =
      await response.json();

    setProducts(data);

  } catch (err) {

    console.log(err);

  }

};
useEffect(() => {
  loadProducts();
}, []);
async function updateProduct() {

  if (!selectedProduct) return;

  try {

    const response = await fetch(
      `https://brekkie-api.onrender.com/products/${selectedProduct.id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({

          name: editName,

          category: editCategory,

          temperature: editTemperature,

          price: Number(editPrice),

          loyalty_value: Number(editLoyaltyValue),

        }),

      }
    );

    const result = await response.json();

    if (!result.success) {

      Alert.alert(
        "Hata",
        result.error
      );

      return;

    }

    Alert.alert(
      "Başarılı",
      "Ürün güncellendi."
    );

    setEditVisible(false);

    loadProducts();

  } catch (err) {

    console.log(err);

    Alert.alert(
      "Hata",
      "Ürün güncellenemedi."
    );

  }

}
async function createProduct() {

  try {

    const response = await fetch(
      "https://brekkie-api.onrender.com/products",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({

          store_id: 3,

          name: newName,

          category: newCategory,

          temperature: newTemperature,

          price: Number(newPrice),

          loyalty_value: Number(newLoyaltyValue),

        }),

      }
    );

    const result = await response.json();

    if (!result.success) {

      Alert.alert(
        "Hata",
        result.error
      );

      return;

    }

    Alert.alert(
      "Başarılı",
      "Ürün oluşturuldu."
    );

    setAddVisible(false);

    setNewName("");
    setNewPrice("");
    setNewCategory("Coffee");
    setNewTemperature("Hot");
    setNewLoyaltyValue("1");

    loadProducts();

  } catch (err) {

    console.log(err);

    Alert.alert(
      "Hata",
      "Ürün oluşturulamadı."
    );

  }

}
async function toggleProductStatus(product: Product) {

  try {

    const response = await fetch(
      `https://brekkie-api.onrender.com/products/${product.id}/status`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          is_active: !product.is_active,
        }),

      }
    );

    const result = await response.json();

    if (!result.success) {

      Alert.alert(
        "Hata",
        result.error
      );

      return;

    }

    loadProducts();

  } catch (err) {

    console.log(err);

    Alert.alert(
      "Hata",
      "Durum güncellenemedi."
    );

  }

}
async function deleteProduct(product: Product) {

  Alert.alert(
    "Ürünü Sil",
    `"${product.name}" ürününü silmek istediğinize emin misiniz?`,
    [
      {
        text: "İptal",
        style: "cancel",
      },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {

          try {

            const response = await fetch(
              `https://brekkie-api.onrender.com/products/${product.id}`,
              {
                method: "DELETE",
              }
            );

            const result = await response.json();

            if (!result.success) {

              Alert.alert(
                "Silinemedi",
                result.error
              );

              return;

            }

            Alert.alert(
              "Başarılı",
              "Ürün silindi."
            );

            loadProducts();

          } catch (err) {

            console.log(err);

            Alert.alert(
              "Hata",
              "Ürün silinemedi."
            );

          }

        },
      },
    ]
  );

}
  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding:20 }}
    >

      {products.map((item) => (

        <View
          key={item.id}
          style={[
  styles.card,
  !item.is_active && styles.inactiveCard,
]}
        >

          <Text style={styles.title}>
            {item.temperature === "Iced"
              ? "🧊 "
              : "☕ "}
            {item.name}
          </Text>

          <Text style={styles.info}>
        {item.temperature === "Iced" ? "🧊 Soğuk" : "🔥 Sıcak"}
        </Text>

          <Text style={styles.price}>
            ₺{Number(item.price).toFixed(0)}
          </Text>
<View style={styles.actions}>

  <TouchableOpacity
    style={styles.editButton}
    onPress={() => {

      setSelectedProduct(item);

      setEditName(item.name);
      setEditCategory(item.category);
      setEditTemperature(item.temperature);
      setEditPrice(item.price.toString());
      setEditLoyaltyValue(item.loyalty_value.toString());

      setEditVisible(true);

    }}
  >
    <Text style={styles.buttonText}>
      ✏️ Düzenle
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.statusButton}
    onPress={() => toggleProductStatus(item)}
  >
    <Text style={styles.buttonText}>
      {item.is_active
        ? "🚫 Pasif"
        : "✅ Aktif"}
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.removeButton}
    onPress={() => deleteProduct(item)}
  >
    <Text style={styles.buttonText}>
      🗑️ Sil
    </Text>
  </TouchableOpacity>

</View>
        </View>

      ))}
<TouchableOpacity
  style={styles.addButton}
  onPress={() => setAddVisible(true)}
>

  <Text style={styles.addButtonText}>
    ＋ Yeni Ürün Ekle
  </Text>

</TouchableOpacity>
<Modal
  visible={addVisible}
  animationType="slide"
  transparent
>

  <View style={styles.modalBackground}>

    <View style={styles.modal}>

      <Text style={styles.modalTitle}>
        Yeni Ürün
      </Text>

      <TextInput
        placeholder="Ürün Adı"
        value={newName}
        onChangeText={setNewName}
        style={styles.input}
      />

      <TextInput
        placeholder="Kategori"
        value={newCategory}
        onChangeText={setNewCategory}
        style={styles.input}
      />

      <Text style={styles.label}>
  Sıcaklık
</Text>

<View style={styles.optionRow}>

  <TouchableOpacity
    style={[
      styles.optionButton,
      newTemperature === "Hot" &&
      styles.optionButtonActive,
    ]}
    onPress={() => setNewTemperature("Hot")}
  >
    <Text
      style={[
        styles.optionText,
        newTemperature === "Hot" && { color: "#fff" },
      ]}
    >
      🔥 Sıcak
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[
      styles.optionButton,
      newTemperature === "Iced" &&
      styles.optionButtonActive,
    ]}
    onPress={() => setNewTemperature("Iced")}
  >
    <Text
      style={[
        styles.optionText,
        newTemperature === "Iced" && { color: "#fff" },
      ]}
    >
      🧊 Soğuk
    </Text>
  </TouchableOpacity>

</View>

      <TextInput
        placeholder="Fiyat"
        keyboardType="numeric"
        value={newPrice}
        onChangeText={setNewPrice}
        style={styles.input}
      />

      <TextInput
        placeholder="Sadakat Puanı"
        keyboardType="numeric"
        value={newLoyaltyValue}
        onChangeText={setNewLoyaltyValue}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.saveButton}
        onPress={createProduct}
      >
        <Text style={styles.saveButtonText}>
          Ürünü Oluştur
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => setAddVisible(false)}
      >
        <Text style={styles.cancelButtonText}>
          İptal
        </Text>
      </TouchableOpacity>

    </View>

  </View>

</Modal>
<Modal
  visible={editVisible}
  animationType="slide"
  transparent
>

  <View style={styles.modalBackground}>

    <View style={styles.modal}>

      <Text style={styles.modalTitle}>
        Ürün Düzenle
      </Text>

      <TextInput
        value={editName}
        onChangeText={setEditName}
        placeholder="Ürün Adı"
        style={styles.input}
      />

      <TextInput
        value={editCategory}
        onChangeText={setEditCategory}
        placeholder="Kategori"
        style={styles.input}
      />

      <Text style={styles.label}>
  Sıcaklık
</Text>

<View style={styles.optionRow}>

  <TouchableOpacity
    style={[
      styles.optionButton,
      editTemperature === "Hot" &&
      styles.optionButtonActive,
    ]}
    onPress={() => setEditTemperature("Hot")}
  >
    <Text
      style={[
        styles.optionText,
        editTemperature === "Hot" && { color: "#fff" },
      ]}
    >
      🔥 Sıcak
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[
      styles.optionButton,
      editTemperature === "Iced" &&
      styles.optionButtonActive,
    ]}
    onPress={() => setEditTemperature("Iced")}
  >
    <Text
      style={[
        styles.optionText,
        editTemperature === "Iced" && { color: "#fff" },
      ]}
    >
      🧊 Soğuk
    </Text>
  </TouchableOpacity>

</View>

      <TextInput
        value={editPrice}
        onChangeText={setEditPrice}
        keyboardType="numeric"
        placeholder="Fiyat"
        style={styles.input}
      />
      <TextInput
  value={editLoyaltyValue}
  onChangeText={setEditLoyaltyValue}
  keyboardType="numeric"
  placeholder="Sadakat Puanı"
  style={styles.input}
/>

      <TouchableOpacity
  style={styles.saveButton}
  onPress={updateProduct}
>

        <Text style={styles.saveButtonText}>
          Kaydet
        </Text>

      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => setEditVisible(false)}
      >

        <Text style={styles.cancelButtonText}>
          İptal
        </Text>

      </TouchableOpacity>

    </View>

  </View>

</Modal>
    </ScrollView>

  );
}

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:"#F8F5F0",
},

card:{
backgroundColor:"#fff",
padding:18,
borderRadius:18,
marginBottom:16,
elevation:4,
},

title:{
fontSize:18,
fontWeight:"800",
color:"#004225",
},

info:{
marginTop:6,
color:"#666",
},

price:{
marginTop:10,
fontSize:18,
fontWeight:"700",
color:"#C97C4A",
},
actions:{
  flexDirection:"row",
  justifyContent:"space-between",
  marginTop:20,
},

editButton:{
  flex:1,
  backgroundColor:"#E8B07A",
  padding:12,
  borderRadius:12,
  alignItems:"center",
  marginRight:8,
},

statusButton:{
  flex:1,
  backgroundColor:"#F0AD4E",
  padding:12,
  borderRadius:12,
  alignItems:"center",
  marginHorizontal:4,
},

removeButton:{
  flex:1,
  backgroundColor:"#D9534F",
  padding:12,
  borderRadius:12,
  alignItems:"center",
  marginLeft:4,
},

buttonText:{
  color:"#fff",
  fontWeight:"700",
},
addButton:{
  marginTop:20,
  backgroundColor:"#004225",
  padding:18,
  borderRadius:18,
  alignItems:"center",
},

addButtonText:{
  color:"#fff",
  fontSize:18,
  fontWeight:"800",
},
modalBackground:{
  flex:1,
  backgroundColor:"rgba(0,0,0,0.4)",
  justifyContent:"center",
  padding:20,
},

modal:{
  backgroundColor:"#fff",
  borderRadius:20,
  padding:20,
},

modalTitle:{
  fontSize:22,
  fontWeight:"800",
  marginBottom:20,
  color:"#004225",
},

input:{
  borderWidth:1,
  borderColor:"#ddd",
  borderRadius:12,
  padding:14,
  marginBottom:14,
},

saveButton:{
  backgroundColor:"#004225",
  padding:16,
  borderRadius:14,
  alignItems:"center",
},

saveButtonText:{
  color:"#fff",
  fontWeight:"800",
},

cancelButton:{
  marginTop:12,
  alignItems:"center",
},

cancelButtonText:{
  color:"#D9534F",
  fontWeight:"700",
},
inactiveCard: {
  opacity: 0.55,
},
label: {
  fontSize: 16,
  fontWeight: "700",
  color: "#262626",
  marginBottom: 8,
},

optionRow: {
  flexDirection: "row",
  marginBottom: 16,
},

optionButton: {
  flex: 1,
  padding: 14,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#DDD",
  alignItems: "center",
  marginHorizontal: 4,
},

optionButtonActive: {
  backgroundColor: "#004225",
  borderColor: "#004225",
},

optionText: {
  fontWeight: "700",
  color: "#262626",
},
});