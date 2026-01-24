import { Routes, Route } from "react-router-dom";

import Cakes from "../pages/Products/Cakes";
import Chocolates from "../pages/Products/Chocolates";
import Cookies from "../pages/Products/Cookies";
import MoreItems from "../pages/Products/MoreItems";
import OrderFlow from "../pages/OrderFlow";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/cakes" element={<Cakes />} />
      <Route path="/chocolates" element={<Chocolates />} />
      <Route path="/cookies" element={<Cookies />} />
      <Route path="/more-items" element={<MoreItems />} />
      <Route path="/order" element={<OrderFlow />} />
    </Routes>
  );
};

export default AppRoutes;
