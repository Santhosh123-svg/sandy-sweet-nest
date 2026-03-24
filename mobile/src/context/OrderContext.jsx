import { createContext, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {

const [order, setOrder] = useState(null);

const placeOrder = async (data) => {

if (!data) return;

let user = null;

try {
const userString = await AsyncStorage.getItem("user");
user = userString ? JSON.parse(userString) : null;
} catch (err) {
user = null;
}

setOrder({
...data,
orderId: data.orderId || order?.orderId || "",
customer: {
name: user?.name || "",
email: user?.email || "",
phone: user?.phone || "",
address: user?.address || "",
},
});

};

const clearOrder = () => {
setOrder(null);
};

return (

<OrderContext.Provider
value={{
order,
placeOrder,
clearOrder
}}
>

{children}

</OrderContext.Provider>

);

};

export const useOrder = () => useContext(OrderContext);