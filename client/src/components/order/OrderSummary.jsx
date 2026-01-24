import { useOrder } from "../../context/OrderContext";

const OrderSummary = () => {
  const { order } = useOrder();

  return (
    <div className="mt-6 bg-white p-4 rounded-2xl shadow">
      <p className="font-semibold">Price: ₹ {order.price}</p>
    </div>
  );
};

export default OrderSummary;
