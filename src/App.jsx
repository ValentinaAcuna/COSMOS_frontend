import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import ProtectedRoute from './components/ProtectedRoute'
import Auth from './pages/Auth'
import NewProduct from './pages/NewProduct'

function GuestOnlyRoute({ children }) {
  const { isAdmin } = useAuth()
  return isAdmin ? <Navigate to="/" replace /> : children
}

export default function App() {
  return (
    <AuthProvider>
    <CartProvider>
      <BrowserRouter>
        <Header />
        <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/productos/nuevo" element={<ProtectedRoute><NewProduct /></ProtectedRoute>} />
          <Route path="/productos/:id" element={<ProductDetail />} />
          <Route path="/carrito" element={<GuestOnlyRoute><Cart /></GuestOnlyRoute>} />
          <Route path="/login" element={<Auth />} />
          <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/perfil/editar" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </CartProvider>
    </AuthProvider>
  )
}
