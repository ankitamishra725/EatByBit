import { createContext, useContext, useState } from "react"

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  const addItem    = (item)  => setCart(prev => [...prev, item])
  const removeItem = (index) => setCart(prev => prev.filter((_, i) => i !== index))
  const clearCart  = ()      => setCart([])
  const total      = cart.reduce((s, i) => s + i.studentPrice, 0)

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, clearCart, total }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)