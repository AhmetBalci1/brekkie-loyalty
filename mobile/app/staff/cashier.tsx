import { router } from "expo-router";
import { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import HeaderCard
from "../components/cashier/HeaderCard";
import ScanCard from "../components/cashier/ScanCard";
import CustomerCard
from "../components/cashier/CustomerCard";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
} from "react-native";

import AsyncStorage
from "@react-native-async-storage/async-storage";

export default function CashierScreen() {
const [staffName, setStaffName] =
  useState("");
const [products, setProducts] = useState<any[]>([]);
const [selectedProduct, setSelectedProduct] = useState<any>(null);
const [cart, setCart] = useState<any[]>([]);
const [modalVisible, setModalVisible] = useState(false);
const [quantity, setQuantity] = useState(1);
const [staffId, setStaffId] = useState<number | null>(null);
const [staffRole, setStaffRole] =
  useState("");
  const [authorized,
    setAuthorized] =
    useState(false);


  useEffect(() => {

    const checkStaff =
      async () => {

      const isStaff =
        await AsyncStorage.getItem(
          "staff"
        );
        const name =
  await AsyncStorage.getItem(
    "staffName"
  );

const role =
  await AsyncStorage.getItem(
    "staffRole"
  );
  const id =
  await AsyncStorage.getItem(
    "staffId"
  );

setStaffName(name || "");

setStaffRole(role || "");
setStaffId(id ? Number(id) : null);
      if (!isStaff) {

        router.replace(
          "/" as any
        );

        return;
      }

      setAuthorized(true);
    };

    checkStaff();

  }, []);
  useEffect(() => {

  fetch("https://brekkie-api.onrender.com/products")
    .then(res => res.json())
    .then(setProducts)
    .catch(console.log);

}, []);

  const {
    userId,
    customerName,
    coffeeCount,
    freeCoffee,
    loyaltyLevel,
  } = useLocalSearchParams();
 const [currentCustomer, setCurrentCustomer] = useState({
  userId: userId ? Number(userId) : 0,
  name: String(customerName || ""),
  coffeeCount: Number(coffeeCount || 0),
  freeCoffee: Number(freeCoffee || 0),
  loyaltyLevel: String(loyaltyLevel || "Standart"),
});
const useReward = async () => {
  try {
    const response = await fetch(
      "https://brekkie-api.onrender.com/use-reward",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentCustomer.userId,
        }),
      }
    );

    const result = await response.json();

    if (result.success) {
      Alert.alert(
        "Başarılı",
        "Ücretsiz kahve kullanıldı ☕"
      );

      const user = result.user;

      const totalCoffee =
        user.coffee_count +
        user.free_coffee * 10;

      let loyaltyLevel = "Bronze ☕";

      if (totalCoffee >= 10)
        loyaltyLevel = "Silver ✨";

      if (totalCoffee >= 25)
        loyaltyLevel = "Gold 👑";

      if (totalCoffee >= 50)
        loyaltyLevel = "Emerald 💎";

      setCurrentCustomer({
        userId: user.id,
        name: user.name,
        coffeeCount: user.coffee_count,
        freeCoffee: user.free_coffee,
        loyaltyLevel,
      });

      await loadHistory();


    } else {

      Alert.alert(
        "Hata",
        result.error || "İşlem başarısız."
      );

    }

  } catch (err) {
    console.log(err);
  }
};

  const [history,setHistory] = useState<any[]>([]);
const loadHistory = async () => {
  
  try {

    const response =
      await fetch(
        "https://brekkie-api.onrender.com/recent-scans"
      );

    const data =
      await response.json();

    setHistory(data);

  } catch (err) {

    console.log(err);

  }

};
const addCoffee = async () => {
  try {
    const response = await fetch(
      "https://brekkie-api.onrender.com/scan",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentCustomer.userId,
        }),
      }
    );

    const result = await response.json();
    console.log("SCAN RESULT:", result);
console.log("CURRENT USER:", currentCustomer);

    if (result.success) {

      Alert.alert(
        "Başarılı",
        "Kahve başarıyla eklendi ☕"
      );

      const user = result.user;

      const totalCoffee =
        user.coffee_count +
        user.free_coffee * 10;

      let loyaltyLevel = "Bronze ☕";

      if (totalCoffee >= 10)
        loyaltyLevel = "Silver ✨";

      if (totalCoffee >= 25)
        loyaltyLevel = "Gold 👑";

      if (totalCoffee >= 50)
        loyaltyLevel = "Emerald 💎";

      setCurrentCustomer({
        userId: user.id,
        name: user.name,
        coffeeCount: user.coffee_count,
        freeCoffee: user.free_coffee,
        loyaltyLevel,
      });

      await loadHistory();

    } else {

      Alert.alert(
        "Hata",
        result.error || "Kahve eklenemedi."
      );

    }

  } catch (err) {

    console.log(err);

    Alert.alert(
      "Hata",
      "Sunucuya ulaşılamadı."
    );

  }
};
const addToCart = () => {

  if (!selectedProduct) return;

  const existing = cart.find(
    item => item.id === selectedProduct.id
  );

  if (existing) {

    setCart(
      cart.map(item =>
        item.id === selectedProduct.id
          ? {
              ...item,
              quantity:
                item.quantity + quantity,
            }
          : item
      )
    );

  } else {

    setCart([
      ...cart,
      {
        ...selectedProduct,
        quantity,
      },
    ]);

  }

  setModalVisible(false);
  setSelectedProduct(null);
  setQuantity(1);

};
const totalQuantity = cart.reduce(
  (sum, item) => sum + item.quantity,
  0
);

const totalPrice = cart.reduce(
  (sum, item) =>
    sum + Number(item.price) * item.quantity,
  0
);
const completeSale = async () => {

  if (cart.length === 0) return;

  try {

    const response = await fetch(
      "https://brekkie-api.onrender.com/sale",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
body: JSON.stringify({
  userId: currentCustomer.userId,
  staffId,
  items: cart.map(item => ({
    productId: item.id,
    quantity: item.quantity,
  })),
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
  "Satış Başarılı",
  "Satış başarıyla tamamlandı."
);

 setSelectedProduct(null);

setCart([]);

setQuantity(1);

setCurrentCustomer({
  userId: 0,
  name: "",
  coffeeCount: 0,
  freeCoffee: 0,
  loyaltyLevel: "Standart",
});
  } catch (err) {

    console.log(err);

    Alert.alert(
      "Hata",
      "Satış gerçekleştirilemedi."
    );

  }

};
  useEffect(() => {

  loadHistory();

}, []);

  if (!authorized) {

    return null;
  }
const modalTotal =
  selectedProduct
    ? Number(selectedProduct.price) * quantity
    : 0;
  return (

    <ScrollView 
      style={styles.container}
      contentContainerStyle={{
        alignItems: "center",
        paddingBottom: 40,
      }}
      showsVerticalScrollIndicator={false}
      >

  <HeaderCard
  staffName={staffName}
  staffRole={staffRole}
/>

      <Text style={styles.subtitle}>
        Müşteri QR kodunu okutun
      </Text>

 <ScanCard
  onPress={() =>
    router.push({
      pathname: "/scanner",
      params: {
        cashierMode: "true",
      },
    })
  }
/>
{currentCustomer.userId > 0 && (
  <CustomerCard
    name={currentCustomer.name}
    coffeeCount={currentCustomer.coffeeCount}
    freeCoffee={currentCustomer.freeCoffee}
    membership={currentCustomer.loyaltyLevel}
    onUseReward={useReward}
  />
)}
{currentCustomer.userId === 0 && (

  <View style={styles.waitingCard}>

    <Text style={styles.waitingTitle}>
      📷 Müşteri Bekleniyor
    </Text>

    <Text style={styles.waitingText}>
      Ürün satışı yapabilmek için önce müşterinin QR kodunu okutun.
    </Text>

  </View>

)}
{currentCustomer.userId > 0 && (
  <>
    <Text style={styles.sectionTitle}>
      Ürün Seç
    </Text>

    {products.map((item) => (

      <TouchableOpacity
  key={item.id}
style={[
  styles.productCard,
  cart.some(
    p => p.id === item.id
  ) && styles.selectedProduct,
]}
  onPress={() => {
  setSelectedProduct(item);
  setQuantity(1);
  setModalVisible(true);
}}
>

        <View>

          <Text style={styles.productName}>
            {item.temperature === "Iced"
              ? "🧊 "
              : "☕ "}
            {item.name}
          </Text>

          <Text style={styles.info}>
            {item.temperature === "Iced"
              ? "🧊 Soğuk"
              : "🔥 Sıcak"}
          </Text>

          <Text style={styles.productPrice}>
            ₺{Number(item.price).toFixed(0)}
          </Text>

        </View>

      </TouchableOpacity>

    ))}
    {cart.length > 0 && (

<View style={styles.cartCard}>

  <Text style={styles.cartTitle}>
    🛒 Sepet
  </Text>

  {cart.map(item => (

    <View
      key={item.id}
      style={styles.cartItem}
    >

      <View>

        <Text style={styles.cartName}>
          {item.name}
        </Text>

        <Text style={styles.cartPrice}>
          ₺{Number(item.price).toFixed(0)}
        </Text>

      </View>

      <View style={styles.cartRight}>

        <Text style={styles.cartQuantity}>
          x{item.quantity}
        </Text>

      <View style={styles.cartControls}>

  <TouchableOpacity
    style={styles.cartQtyButton}
    onPress={() => {

      if (item.quantity === 1) {

        setCart(
          cart.filter(
            p => p.id !== item.id
          )
        );

      } else {

        setCart(
          cart.map(p =>
            p.id === item.id
              ? {
                  ...p,
                  quantity: p.quantity - 1,
                }
              : p
          )
        );

      }

    }}
  >
    <Text style={styles.cartQtyText}>−</Text>
  </TouchableOpacity>

  <Text style={styles.cartQuantity}>
    {item.quantity}
  </Text>

  <TouchableOpacity
    style={styles.cartQtyButton}
    onPress={() =>

      setCart(
        cart.map(p =>
          p.id === item.id
            ? {
                ...p,
                quantity: p.quantity + 1,
              }
            : p
        )
      )

    }
  >
    <Text style={styles.cartQtyText}>+</Text>
  </TouchableOpacity>

</View>

      </View>

    </View>

  ))}

  <View style={styles.summary}>

    <Text style={styles.summaryText}>
      Toplam Kahve
    </Text>

    <Text style={styles.summaryValue}>
      {totalQuantity}
    </Text>

  </View>

  <View style={styles.summary}>

    <Text style={styles.summaryText}>
      Toplam Tutar
    </Text>

    <Text style={styles.summaryValue}>
      ₺{totalPrice.toFixed(0)}
    </Text>

  </View>

</View>

)}
    {cart.length > 0 && (

  <TouchableOpacity
  style={styles.completeSaleButton}
  onPress={completeSale}
>

    <Text style={styles.completeSaleText}>
  Satışı Tamamla ({totalQuantity})
</Text>

  </TouchableOpacity>

)}
  </>
)}

      <TouchableOpacity
  style={styles.logoutButton}
  onPress={async () => {

   await AsyncStorage.multiRemove([
  "staff",
  "staffId",
  "staffName",
  "staffRole",
]);

    router.replace(
      "/staff-login" as any
    );
  }}
>
  <Text style={styles.logoutText}>
    Çıkış Yap
  </Text>
</TouchableOpacity>
<Modal
  visible={modalVisible}
  transparent
  animationType="slide"
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalOverlay}>

    <View style={styles.modalContent}>

      <Text style={styles.modalTitle}>
        {selectedProduct?.name}
      </Text>

      <View style={styles.quantityRow}>

        <TouchableOpacity
          style={styles.qtyButton}
          onPress={() =>
            quantity > 1 &&
            setQuantity(quantity - 1)
          }
        >
          <Text style={styles.qtyText}>−</Text>
        </TouchableOpacity>

        <Text style={styles.quantity}>
          {quantity}
        </Text>

        <TouchableOpacity
          style={styles.qtyButton}
          onPress={() =>
            setQuantity(quantity + 1)
          }
        >
          <Text style={styles.qtyText}>+</Text>
        </TouchableOpacity>

      </View>
      <Text style={styles.modalInfo}>
  {quantity} × ₺{Number(selectedProduct?.price ?? 0).toFixed(2)}
</Text>

<Text style={styles.modalTotal}>
  Toplam: ₺{modalTotal.toFixed(2)}
</Text>

    <TouchableOpacity
  style={styles.completeSaleButton}
  onPress={addToCart}
>
  <Text style={styles.completeSaleText}>
    Sepete Ekle
  </Text>
</TouchableOpacity>

    </View>

  </View>
</Modal>
    </ScrollView>
    
  );
  
}

const styles = StyleSheet.create({

  container: {
    flex: 1,

    backgroundColor: "#F8F5F0", // Eski: #004225

    padding: 24,
  },

  title: {
    color: "#262626", // Eski: #fff4e3

    fontSize: 34,

    fontWeight: "900",

    marginTop: 20,

    letterSpacing: 2,
  },

  subtitle: {
    color: "#C97C4A", // Eski: #d4af37

    fontSize: 18,

    marginBottom: 2,
  },

  scanButton: {
    width: "100%",

    backgroundColor: "#E8B07A", // Eski: #d4af37

    paddingVertical: 32,

    borderRadius: 26,

    alignItems: "center",

    marginVertical: 18,

    shadowColor: "#E8B07A",

    shadowOffset: {
      width: 0,
      height: 6,
    },

    shadowOpacity: 0.20,

    shadowRadius: 8,

    elevation: 6,
  },

  scanButtonText: {
    color: "#262626", // Eski: #2a1d17

    fontSize: 28,

    fontWeight: "900",

    letterSpacing: 1,
  },

  logoutButton: {
    width: "100%",

    marginTop: 15,

    paddingVertical: 16,

    borderRadius: 20,

    backgroundColor: "#D9534F", // Eski: #7a1f1f

    alignItems: "center",
  },

  logoutText: {
    color: "#FFFFFF",

    fontWeight: "800",

    fontSize: 16,
  },

  staffName: {
    color: "#262626", // Eski: #fff4e3

    fontSize: 18,

    fontWeight: "700",

    marginTop: 8,
  },

  staffRole: {
    color: "#8A8178", // Eski: #d4af37

    fontSize: 15,

    marginBottom: 16,
  },
productCard:{
  width: "100%",
  backgroundColor:"#fff",
  padding:16,
  borderRadius:16,
  marginBottom:12,
  borderWidth:1,
  borderColor:"#EADBC8",
},

productName:{
  fontSize:17,
  fontWeight:"700",
  color:"#262626",
},

productPrice:{
  marginTop:4,
  color:"#C97C4A",
  fontWeight:"700",
},
sectionTitle: {
  fontSize: 22,
  fontWeight: "800",
  color: "#262626",
  marginTop: 24,
  marginBottom: 16,
  alignSelf: "flex-start",
},
waitingCard:{
  width:"100%",
  backgroundColor:"#FFF8EE",
  borderRadius:16,
  padding:18,
  marginTop:18,
  borderWidth:1,
  borderColor:"#E8B07A",
},

waitingTitle:{
  fontSize:18,
  fontWeight:"800",
  color:"#C97C4A",
  marginBottom:8,
},

waitingText:{
  color:"#666",
  lineHeight:22,
},
info: {
  marginTop: 4,
  color: "#666",
  fontSize: 14,
},
selectedProduct: {
  borderColor: "#E8B07A",
  borderWidth: 3,
  backgroundColor: "#FFF8EE",
},
completeSaleButton: {
  width: "100%",
  backgroundColor:"#E8B07A",
  padding: 18,
  borderRadius: 18,
  alignItems: "center",
  marginTop: 12,
  marginBottom: 20,
},

completeSaleText: {
  color: "#fff",
  fontSize: 18,
  fontWeight: "800",
},
modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.45)",
  justifyContent: "center",
  alignItems: "center",
},

modalContent: {
  width: "85%",
  backgroundColor: "#fff",
  borderRadius: 24,
  padding: 24,
},

modalTitle: {
  fontSize: 22,
  fontWeight: "800",
  color: "#262626",
  textAlign: "center",
  marginBottom: 24,
},

quantityRow: {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 30,
},

qtyButton: {
  width: 50,
  height: 50,
  borderRadius: 25,
  backgroundColor: "#F1B993",
  justifyContent: "center",
  alignItems: "center",
},

qtyText: {
  fontSize: 28,
  fontWeight: "800",
  color: "#262626",
},

quantity: {
  fontSize: 28,
  fontWeight: "800",
  marginHorizontal: 30,
  color: "#262626",
},
cartCard:{
  width:"100%",
  backgroundColor:"#fff",
  borderRadius:18,
  padding:18,
  marginTop:18,
  marginBottom:18,
},

cartTitle:{
  fontSize:20,
  fontWeight:"800",
  color:"#262626",
  marginBottom:16,
},

cartItem:{
  flexDirection:"row",
  justifyContent:"space-between",
  alignItems:"center",
  marginBottom:14,
},

cartName:{
  fontSize:16,
  fontWeight:"700",
  color:"#262626",
},

cartPrice:{
  color:"#888",
  marginTop:4,
},

cartRight:{
  alignItems:"flex-end",
},

cartQuantity:{
  fontSize:18,
  fontWeight:"800",
  color:"#C97C4A",
},

removeText:{
  color:"#D9534F",
  marginTop:6,
},

summary:{
  flexDirection:"row",
  justifyContent:"space-between",
  marginTop:12,
  borderTopWidth:1,
  borderColor:"#EADBC8",
  paddingTop:12,
},

summaryText:{
  fontSize:16,
  fontWeight:"700",
},

summaryValue:{
  fontSize:16,
  fontWeight:"800",
  color:"#262626",
},
cartControls:{
  flexDirection:"row",
  alignItems:"center",
},

cartQtyButton:{
  width:34,
  height:34,
  borderRadius:17,
  backgroundColor:"#E8B07A",
  justifyContent:"center",
  alignItems:"center",
},

cartQtyText:{
  fontSize:22,
  fontWeight:"800",
  color:"#262626",
},
modalInfo: {
  textAlign: "center",
  color: "#777",
  fontSize: 15,
  marginBottom: 8,
},

modalTotal: {
  textAlign: "center",
  fontSize: 22,
  fontWeight: "800",
  color: "#262626",
  marginBottom: 24,
},
});