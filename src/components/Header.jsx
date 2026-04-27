import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import CosmosLogo from './CosmosLogo'
import './Header.css'

export default function Header() {
  const { count } = useCart()
  const { isLoggedIn, isAdmin, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const isHome = location.pathname === '/'

  function handleLogout() {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header className={`header ${isHome ? '' : 'header--solid'}`}>
      <div className="header__content">
        <button className="header__menu-btn" onClick={() => setMenuOpen(o => !o)} aria-label="Menú">
          <span /><span /><span />
        </button>

        {!isHome && (
          <Link to="/" className="header__logo">
            <CosmosLogo />
          </Link>
        )}

        <div className="header__actions">
          {!isAdmin && (
            <Link to="/carrito" className="header__action-btn" aria-label="Carrito">
              <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.98-1.73L23 6H6"/>
              </svg>
              {isLoggedIn && count > 0 && <span className="header__cart-badge">{count}</span>}
            </Link>
          )}
          <Link to="/perfil" className="header__action-btn" aria-label="Perfil">
            <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </Link>
          <Link to="/productos" className="header__action-btn" aria-label="Buscar">
            <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </Link>
        </div>
      </div>

      {menuOpen && (
        <nav className="header__nav">
          <Link to="/" onClick={() => setMenuOpen(false)}>Inicio</Link>
          <Link to="/productos" onClick={() => setMenuOpen(false)}>Productos</Link>
          {!isAdmin && <Link to="/carrito" onClick={() => setMenuOpen(false)}>Carrito</Link>}
          <Link to="/perfil" onClick={() => setMenuOpen(false)}>Perfil</Link>
          {isLoggedIn
            ? <button className="header__nav-logout" onClick={handleLogout}>Cerrar sesión</button>
            : <Link to="/login" onClick={() => setMenuOpen(false)}>Iniciar sesión / Registrarse</Link>
          }
        </nav>
      )}
    </header>
  )
}
