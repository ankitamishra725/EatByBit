import { BrowserRouter, Routes, Route } from "react-router-dom"
import { CartProvider } from "./CartContext"
import Navbar         from "./components/Navbar"
import Home           from "./pages/Home"
import Menu           from "./pages/Menu"
import Login          from "./pages/Login"
import Register       from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"
import OrderTray      from "./pages/OrderTray"
import Profile        from "./pages/Profile"
import Coupons        from "./pages/Coupons"
import BrokeMode      from "./pages/BrokeMode"

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"                element={<Home />} />
          <Route path="/menu"            element={<Menu />} />
          <Route path="/login"           element={<Login />} />
          <Route path="/register"        element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/tray"            element={<OrderTray />} />
          <Route path="/profile"         element={<Profile />} />
          <Route path="/coupons"         element={<Coupons />} />
          <Route path="/broke"           element={<BrokeMode />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App