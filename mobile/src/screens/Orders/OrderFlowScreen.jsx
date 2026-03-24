import React, { useState, useEffect } from "react";
import {
View,
Text,
TouchableOpacity,
StyleSheet,
ScrollView,
Image,
Alert
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useOrder } from "../../context/OrderContext";

const OrderFlowScreen = ({ navigation }) => {

const { order, placeOrder } = useOrder();

const [quantity, setQuantity] = useState(1);
const [flavor, setFlavor] = useState("");
const [toppings, setToppings] = useState([]);
const [size, setSize] = useState("1kg");
const [shape, setShape] = useState("circle");
const [total, setTotal] = useState(0);

useEffect(() => {
if (!order) navigation.navigate("Welcome");
}, [order]);

const isCake =
order?.category?.toLowerCase() === "cake" ||
order?.category?.toLowerCase() === "cakes";

const flavorOptions = [
"Dark Chocolate",
"Vanilla",
"Red Velvet"
];

const toppingOptions = [
{ name: "Nuts", price: 50 },
{ name: "Choco Chips", price: 40 },
{ name: "Strawberry", price: 60 },
{ name: "Oreo", price: 70 }
];

const sizeOptions = [
{ label: "½ kg", value: "0.5kg", extra: -150, icon: "leaf-outline" },
{ label: "1 kg", value: "1kg", extra: 0, icon: "cube-outline" },
{ label: "1.5 kg", value: "1.5kg", extra: 200, icon: "layers-outline" },
{ label: "2 kg", value: "2kg", extra: 400, icon: "albums-outline" }
];

const shapeOptions = [
{ name: "circle", icon: "ellipse-outline" },
{ name: "square", icon: "square-outline" },
{ name: "rectangle", icon: "tablet-landscape-outline" },
{ name: "heart", icon: "heart-outline" }
];

useEffect(() => {

if (!order) return;

if (isCake) {

const basePrice = order.price;
const sizeExtra =
sizeOptions.find((s) => s.value === size)?.extra || 0;

const toppingTotal = toppings.reduce((a, b) => a + b.price, 0);

setTotal((basePrice + sizeExtra + toppingTotal) * quantity);

} else {

setTotal(order.price * quantity);

}

}, [quantity, toppings, size, order]);

const toggleTopping = (t) => {

setToppings((prev) =>
prev.some((x) => x.name === t.name)
? prev.filter((x) => x.name !== t.name)
: [...prev, t]
);

};

const handleNext = () => {

if (isCake && !flavor) {
Alert.alert("Select Flavor", "Please select cake flavor");
return;
}

placeOrder({
...order,
quantity,
flavor: isCake ? flavor : null,
toppings: isCake ? toppings : [],
size: isCake ? size : null,
shape: isCake ? shape : null,
totalAmount: total
});

navigation.navigate("CustomerDetails");

};

if (!order) return null;

return (

<View style={styles.container}>

<View style={styles.header}>

<TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
<Ionicons name="chevron-back" size={22} color="#fff"/>
</TouchableOpacity>

<Text style={styles.headerTitle}>
{isCake ? "Customize Cake 🎂" : order.productName}
</Text>

<View style={{width:40}}/>

</View>

<ScrollView 
showsVerticalScrollIndicator={false}
contentContainerStyle={{ paddingBottom: 40 }} // 👈 FIXED BUTTON SPACE
>

<Image source={order?.image} style={styles.productImage} />

{isCake && (
<>

{/* FLAVOR */}
<Text style={styles.sectionTitle}>Flavor</Text>
<View style={styles.grid3}>
{flavorOptions.map((f) => (
<TouchableOpacity
key={f}
style={[styles.card, flavor === f && styles.activeCard]}
onPress={() => setFlavor(f)}
>
<MaterialCommunityIcons name="cupcake" size={22} color="#f97316"/>
<Text style={styles.cardText}>{f}</Text>
</TouchableOpacity>
))}
</View>

{/* TOPPINGS */}
<Text style={styles.sectionTitle}>Toppings</Text>
{toppingOptions.map((t) => (
<TouchableOpacity
key={t.name}
style={[
styles.toppingCard,
toppings.some((x) => x.name === t.name) && styles.activeCard
]}
onPress={() => toggleTopping(t)}
>
<View style={styles.row}>
<Ionicons name="ice-cream-outline" size={18} color="#f97316"/>
<Text style={styles.toppingText}>{t.name}</Text>
</View>
<Text style={styles.price}>+₹{t.price}</Text>
</TouchableOpacity>
))}

{/* SIZE */}
<Text style={styles.sectionTitle}>Size & Weight</Text>
<View style={styles.grid2}>
{sizeOptions.map((s) => (
<TouchableOpacity
key={s.value}
style={[styles.card, size === s.value && styles.activeCard]}
onPress={() => setSize(s.value)}
>
<Ionicons name={s.icon} size={20} color="#f97316"/>
<Text style={styles.cardText}>{s.label}</Text>
<Text style={styles.price}>
{s.extra >= 0 ? `+₹${s.extra}` : `₹${s.extra}`}
</Text>
</TouchableOpacity>
))}
</View>

{/* SHAPE */}
<Text style={styles.sectionTitle}>Shape</Text>
<View style={styles.grid2}>
{shapeOptions.map((s) => (
<TouchableOpacity
key={s.name}
style={[styles.card, shape === s.name && styles.activeCard]}
onPress={() => setShape(s.name)}
>
<Ionicons name={s.icon} size={20} color="#f97316"/>
<Text style={styles.cardText}>
{s.name.charAt(0).toUpperCase() + s.name.slice(1)}
</Text>
</TouchableOpacity>
))}
</View>

</>
)}

{/* QUANTITY */}
<Text style={styles.sectionTitle}>Quantity</Text>
<View style={styles.qtyContainer}>

<TouchableOpacity
style={styles.qtyBtn}
onPress={() => setQuantity(Math.max(1, quantity - 1))}
>
<Text style={styles.qtyText}>-</Text>
</TouchableOpacity>

<Text style={styles.qtyValue}>{quantity}</Text>

<TouchableOpacity
style={styles.qtyBtn}
onPress={() => setQuantity(quantity + 1)}
>
<Text style={styles.qtyText}>+</Text>
</TouchableOpacity>

</View>

{/* TOTAL */}
<View style={styles.totalRow}>
<Text style={styles.totalLabel}>Total Amount</Text>
<Text style={styles.totalPrice}>₹{total}</Text>
</View>

{/* BUTTON */}
<TouchableOpacity style={styles.payButton} onPress={handleNext}>
<Text style={styles.payText}>Proceed to Pay</Text>
</TouchableOpacity>

</ScrollView>

</View>
);
};

const styles = StyleSheet.create({
container:{
flex:1,
backgroundColor:"#fff7ed",
paddingHorizontal:20,
paddingTop:60
},

header:{
flexDirection:"row",
alignItems:"center",
justifyContent:"space-between",
marginBottom:20
},

backBtn:{
backgroundColor:"#f97316",
padding:8,
borderRadius:10
},

headerTitle:{
fontSize:20,
fontWeight:"800",
color:"#b45309"
},

productImage:{
width:"100%",
height:210,
borderRadius:18,
marginBottom:20
},

sectionTitle:{
fontSize:16,
fontWeight:"800",
marginTop:20,
marginBottom:10,
color:"#92400e"
},

grid3:{
flexDirection:"row",
flexWrap:"wrap",
gap:12
},

grid2:{
flexDirection:"row",
flexWrap:"wrap",
gap:12
},

card:{
flex:1,
minWidth:"45%",
padding:14,
borderRadius:14,
backgroundColor:"#fff",
alignItems:"center",
borderWidth:1,
borderColor:"#eee",
elevation:2
},

activeCard:{
backgroundColor:"#ffedd5",
borderColor:"#fb923c"
},

cardText:{
marginTop:6,
fontWeight:"700",
fontSize:13
},

toppingCard:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
padding:14,
borderRadius:14,
backgroundColor:"#fff",
borderWidth:1,
borderColor:"#eee",
marginBottom:10,
elevation:2
},

toppingText:{
marginLeft:8,
fontWeight:"600"
},

row:{
flexDirection:"row",
alignItems:"center"
},

price:{
fontWeight:"700",
color:"#ea580c"
},

qtyContainer:{
flexDirection:"row",
justifyContent:"center",
alignItems:"center",
marginTop:25,
marginBottom:10
},

qtyBtn:{
width:45,
height:45,
backgroundColor:"#fb923c",
justifyContent:"center",
alignItems:"center",
borderRadius:12
},

qtyText:{
fontSize:22,
color:"#fff",
fontWeight:"800"
},

qtyValue:{
fontSize:22,
marginHorizontal:25,
fontWeight:"800"
},

totalRow:{
flexDirection:"row",
justifyContent:"space-between",
marginTop:20
},

totalLabel:{
fontSize:16,
fontWeight:"700"
},

totalPrice:{
fontSize:24,
fontWeight:"900",
color:"#ea580c"
},

payButton:{
marginTop:20,
backgroundColor:"#f97316",
padding:16,
borderRadius:16,
alignItems:"center",
elevation:4
},

payText:{
color:"#fff",
fontWeight:"800",
fontSize:16
}
});

export default OrderFlowScreen;