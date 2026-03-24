import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Verify from "./pages/Auth/MagicVerify";
import CompleteProfile from "./pages/Auth/CompleteProfile";
import Welcome from "./pages/Home/Welcome";
import AdminDashboard from "./pages/Admin/AdminDashboard";

import Cakes from "./pages/Products/Cakes";
import Chocolates from "./pages/Products/Chocolates";
import Cookies from "./pages/Products/Cookies";
import MoreItems from "./pages/Products/MoreItems";
import Checkout from "./pages/Checkout";
import CheckoutDetails from "./pages/CheckoutDetails";

/* 🔥 ORDER FLOW */
import OrderFlow from "./pages/OrderFlow";
import CustomerDetails from "./pages/CustomerDetails";
import Payment from "./pages/Payment";
import WhatsAppConfirm from "./pages/WhatsAppConfirm";
import OrderSuccess from "./pages/OrderSuccess";
import OrderHistory from "./pages/Orders/OrderHistory";
import { OrderProvider } from "./context/OrderContext";
import About from "./pages/Home/About";

function App() {
  return (
    <OrderProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/magic-verify" element={<Verify />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/my-orders" element={<OrderHistory />} />
          <Route path="/about" element={<About />} />

          {/* PRODUCTS */}
          <Route path="/cakes" element={<Cakes />} />
          <Route path="/chocolates" element={<Chocolates />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/more-items" element={<MoreItems />} />

          {/* ORDER FLOW */}
          <Route path="/order-flow" element={<OrderFlow />} />
          <Route path="/customer-details" element={<CustomerDetails />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/whatsapp-confirm" element={<WhatsAppConfirm />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-details" element={<CheckoutDetails />} />
        </Routes>
      </BrowserRouter>
    </OrderProvider>
  );
}

export default App;
