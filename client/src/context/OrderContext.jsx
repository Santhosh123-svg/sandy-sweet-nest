import { createContext, useContext, useState } from "react";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [order, setOrder] = useState(null);

  const placeOrder = (data) => {
    // ❌ prevent undefined
    if (!data) return;

    const userString = localStorage.getItem("user");

    let user = null;
    try {
      user = userString ? JSON.parse(userString) : null;
    } catch (err) {
      user = null;
    }

    setOrder({
      ...data,
      customer: {
        name: user?.name || "",
        phone: user?.phone || "",
        address: user?.address || "",
      },
    });
  };

  const clearOrder = () => {
    setOrder(null);
  };

  return (
    <OrderContext.Provider value={{ order, placeOrder, clearOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
