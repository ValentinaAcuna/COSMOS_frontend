import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { token } = useAuth()
  const cartKey = token ? `cart_${token}` : 'cart_guest'
  const pendingLoadRef = useRef(false)

  const [items, setItems] = useState([])

  useEffect(() => {
    pendingLoadRef.current = true
    try {
      setItems(JSON.parse(localStorage.getItem(cartKey)) || [])
    } catch { setItems([]) }
  }, [cartKey])

  useEffect(() => {
    if (pendingLoadRef.current) {
      pendingLoadRef.current = false
      return
    }
    localStorage.setItem(cartKey, JSON.stringify(items))
  }, [items])

  function addItem(product, size, color) {
    setItems(prev => {
      const existing = prev.find(
        i => i.id === product.id && i.size === size && i.color === color
      )
      if (existing) {
        return prev.map(i =>
          i.id === product.id && i.size === size && i.color === color
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { ...product, size, color, quantity: 1 }]
    })
  }

  function updateQuantity(id, size, color, delta) {
    setItems(prev =>
      prev
        .map(i =>
          i.id === id && i.size === size && i.color === color
            ? { ...i, quantity: i.quantity + delta }
            : i
        )
        .filter(i => i.quantity > 0)
    )
  }

  function removeItem(id, size, color) {
    setItems(prev =>
      prev.filter(i => !(i.id === id && i.size === size && i.color === color))
    )
  }

  function clearCart() {
    setItems([])
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
