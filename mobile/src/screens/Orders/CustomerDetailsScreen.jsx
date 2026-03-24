import React, { useState, useEffect, useRef } from "react";
import {
View,
Text,
TouchableOpacity,
StyleSheet,
ScrollView,
Alert,
TextInput,
KeyboardAvoidingView,
Platform
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useOrder } from "../../context/OrderContext";

const CustomerDetailsScreen = ({ navigation }) => {

const { order, placeOrder } = useOrder();
const scrollRef = useRef();

const isCake =
order?.category?.toLowerCase() === "cake" ||
order?.category?.toLowerCase() === "cakes";

const [focusedInput, setFocusedInput] = useState("");

const [cakeDetails, setCakeDetails] = useState({
deliveryDate: "",
preferredTime: "",
purpose: "",
cakeText: ""
});

const [showDatePicker, setShowDatePicker] = useState(false);
const [showTimePicker, setShowTimePicker] = useState(false);

const [selectedDate, setSelectedDate] = useState(new Date());
const [selectedTime, setSelectedTime] = useState(new Date());

useEffect(() => {
if (!order) navigation.navigate("Welcome");
}, [order]);

const onDateChange = (event, date) => {
setShowDatePicker(false);

if (event?.type === "set" && date) {
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(0,0,0,0);

if (date < tomorrow) {
Alert.alert("Invalid Date","Delivery must be after 24 hrs 📅");
return;
}

setSelectedDate(date);

setCakeDetails(prev => ({
...prev,
deliveryDate: date.toISOString().split("T")[0]
}));
}
};

const onTimeChange = (event, time) => {
setShowTimePicker(false);

if (event?.type === "set" && time) {

const hours = time.getHours();
const minutes = time.getMinutes();

if (hours < 9 || hours > 21 || (hours === 21 && minutes > 0)) {
Alert.alert("Invalid Time","9AM - 9PM only ⏰");
return;
}

setSelectedTime(time);

const formatted =
`${hours.toString().padStart(2,"0")}:${minutes
.toString()
.padStart(2,"0")}`;

setCakeDetails(prev => ({
...prev,
preferredTime: formatted
}));
}
};

const handleNext = () => {

const { deliveryDate, preferredTime, purpose, cakeText } = cakeDetails;

if (!deliveryDate || !preferredTime) {
Alert.alert("Missing Info","Fill date & time 🕒");
return;
}

const selectedDateObj = new Date(deliveryDate);
const tomorrow = new Date();

tomorrow.setHours(0,0,0,0);
tomorrow.setDate(tomorrow.getDate() + 1);

if (selectedDateObj < tomorrow) {
Alert.alert("Invalid Date","Must be at least 24 hrs 📅");
return;
}

const [hours, minutes] = preferredTime.split(":").map(Number);

if (hours < 9 || hours > 21 || (hours === 21 && minutes > 0)) {
Alert.alert("Invalid Time","9AM - 9PM only ⏰");
return;
}

if (isCake) {
if (!purpose || !cakeText) {
Alert.alert("Missing Cake Details","Fill all fields 🎂");
return;
}
}

placeOrder({
...order,
cakeInfo: isCake ? cakeDetails : { deliveryDate, preferredTime }
});

navigation.navigate("Payment");
};

if (!order) return null;

return (

<KeyboardAvoidingView
style={{ flex: 1 }}
behavior={Platform.OS === "ios" ? "padding" : "height"}
>

<View style={styles.container}>

{/* HEADER */}
<View style={styles.header}>
<TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
<Ionicons name="arrow-back" size={20} color="#fff"/>
</TouchableOpacity>

<Text style={styles.headerTitle}>
{isCake ? "Cake Details 🎂" : "Order Details"}
</Text>

<View style={{width:40}}/>
</View>

<ScrollView
ref={scrollRef}
showsVerticalScrollIndicator={false}
contentContainerStyle={{paddingBottom:160}}
keyboardShouldPersistTaps="handled"
>

<Text style={styles.title}>Make it Special ✨</Text>

{/* DATE */}
<View style={styles.glassCard}>
<View style={styles.labelRow}>
<Ionicons name="calendar" size={20} color="#fb923c"/>
<Text style={styles.label}>Delivery Date</Text>
</View>

<TouchableOpacity style={styles.inputBox} onPress={() => setShowDatePicker(true)}>
<Text>{cakeDetails.deliveryDate || "Choose your date"}</Text>
</TouchableOpacity>

{showDatePicker && (
<DateTimePicker
value={selectedDate}
mode="date"
minimumDate={new Date(Date.now() + 86400000)}
onChange={onDateChange}
/>
)}
</View>

{/* TIME */}
<View style={styles.glassCard}>
<View style={styles.labelRow}>
<Ionicons name="time" size={20} color="#fb923c"/>
<Text style={styles.label}>Preferred Time</Text>
</View>

<TouchableOpacity style={styles.inputBox} onPress={() => setShowTimePicker(true)}>
<Text>{cakeDetails.preferredTime || "Select time slot"}</Text>
</TouchableOpacity>

{showTimePicker && (
<DateTimePicker
value={selectedTime}
mode="time"
onChange={onTimeChange}
/>
)}
</View>

{/* PURPOSE */}
{isCake && (
<View style={[
styles.glassCard,
focusedInput === "purpose" && styles.focusCard
]}>
<View style={styles.labelRow}>
<MaterialCommunityIcons name="party-popper" size={20} color="#fb923c"/>
<Text style={styles.label}>Occasion</Text>
</View>

<TextInput
style={styles.input}
placeholder="Birthday / Anniversary..."
value={cakeDetails.purpose}
onFocus={()=>{
setFocusedInput("purpose");
scrollRef.current?.scrollTo({y:400,animated:true});
}}
onBlur={()=>setFocusedInput("")}
onChangeText={(text)=>setCakeDetails(prev=>({...prev,purpose:text}))}
/>
</View>
)}

{/* MESSAGE */}
{isCake && (
<View style={[
styles.glassCard,
focusedInput === "cakeText" && styles.focusCard
]}>
<View style={styles.labelRow}>
<Ionicons name="sparkles" size={20} color="#fb923c"/>
<Text style={styles.label}>Message on Cake</Text>
</View>

<TextInput
style={[styles.input,{height:80}]}
multiline
placeholder="Write something sweet ❤️"
value={cakeDetails.cakeText}
onFocus={()=>{
setFocusedInput("cakeText");
scrollRef.current?.scrollToEnd({animated:true});
}}
onBlur={()=>setFocusedInput("")}
onChangeText={(text)=>setCakeDetails(prev=>({...prev,cakeText:text}))}
/>
</View>
)}

</ScrollView>

{/* BUTTON */}
<View style={styles.footer}>
<TouchableOpacity style={styles.continueBtn} onPress={handleNext}>
<Text style={styles.continueText}>Continue 💳</Text>
</TouchableOpacity>
</View>

</View>
</KeyboardAvoidingView>
);
};

const styles = StyleSheet.create({
container:{
flex:1,
backgroundColor:"#fff7ed",
paddingHorizontal:20,
paddingTop:65
},

header:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
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

title:{
fontSize:24,
fontWeight:"900",
textAlign:"center",
marginBottom:25
},

glassCard:{
backgroundColor:"#fff",
padding:18,
borderRadius:18,
marginBottom:18,
elevation:3
},

focusCard:{
borderWidth:2,
borderColor:"#fb923c"
},

labelRow:{
flexDirection:"row",
alignItems:"center",
marginBottom:10,
gap:8
},

label:{
fontWeight:"700"
},

inputBox:{
padding:14,
backgroundColor:"#fff7ed",
borderRadius:12
},

input:{
backgroundColor:"#fff7ed",
padding:14,
borderRadius:12
},

footer:{
position:"absolute",
bottom:20,
left:20,
right:20
},

continueBtn:{
backgroundColor:"#f97316",
padding:16,
borderRadius:16,
alignItems:"center"
},

continueText:{
color:"#fff",
fontWeight:"800"
}
});

export default CustomerDetailsScreen;