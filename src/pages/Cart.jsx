import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'
import './Cart.css'

function addBusinessDays(date, days) {
  const result = new Date(date)
  let added = 0
  while (added < days) {
    result.setDate(result.getDate() + 1)
    const day = result.getDay()
    if (day !== 0 && day !== 6) added++
  }
  return result
}

function formatDate(date) {
  return date.toLocaleDateString('es-UY', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, total } = useCart()
  const { isLoggedIn } = useAuth()
  const [showCheckout, setShowCheckout] = useState(false)
  const [checkoutDone, setCheckoutDone] = useState(false)
  const [userAddress, setUserAddress] = useState('')
  const [deliveryWindow, setDeliveryWindow] = useState({ from: '', to: '' })
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' })

  useEffect(() => {
    if (isLoggedIn) {
      api.getProfile().then(data => setUserAddress(data.address || ''))
    }
  }, [isLoggedIn])

  function handleCardChange(e) {
    const { name, value } = e.target
    let formatted = value
    if (name === 'number') {
      formatted = value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
    }
    if (name === 'expiry') {
      formatted = value.replace(/\D/g, '').slice(0, 4)
      if (formatted.length >= 3) formatted = formatted.slice(0, 2) + '/' + formatted.slice(2)
    }
    if (name === 'cvv') {
      formatted = value.replace(/\D/g, '').slice(0, 4)
    }
    setCard(c => ({ ...c, [name]: formatted }))
  }

  function handleCheckoutSubmit(e) {
    e.preventDefault()
    const today = new Date()
    const from = addBusinessDays(today, 1)
    const to = addBusinessDays(today, 5)
    setDeliveryWindow({ from: formatDate(from), to: formatDate(to) })
    setShowCheckout(false)
    setCheckoutDone(true)
    clearCart()
  }

  if (!isLoggedIn) {
    return (
      <div className="cart-empty">
        <p className="cart-empty__title">Tenés que iniciar sesión para ver tu carrito</p>
        <Link to="/login" className="cart-empty__shop-btn">Iniciar sesión</Link>
      </div>
    )
  }

  if (checkoutDone) {
    return (
      <div className="cart-empty">
        <div className="cart-success">
          <div className="cart-success__icon">✓</div>
          <h2 className="cart-success__title">¡Compra realizada con éxito!</h2>
          <p className="cart-success__msg">
            Tu pedido estará llegando entre el <strong>{deliveryWindow.from}</strong> y el <strong>{deliveryWindow.to}</strong>
            {userAddress ? <> a tu dirección: <strong>{userAddress}</strong></> : '.'}.
          </p>
          <Link to="/productos" className="cart-empty__shop-btn">Seguir comprando</Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <p className="cart-empty__title">Tu carrito está vacío</p>
        <Link to="/productos" className="cart-empty__shop-btn">Ver productos</Link>
      </div>
    )
  }

  return (
    <div className="cart">
      <h1 className="cart__title">Tu Carrito</h1>

      <div className="cart__table-header">
        <span>Productos</span>
        <span>Cantidad:</span>
        <span>Total:</span>
      </div>

      <div className="cart__items">
        {items.map(item => (
          <div key={`${item.id}-${item.size}-${item.color}`} className="cart__item">
            <div className="cart__item-product">
              <img src={item.images[0]} alt={item.name} className="cart__item-img" />
              <div className="cart__item-details">
                <span className="cart__item-name">{item.name}</span>
                <span className="cart__item-meta">Precio: ${Math.round(item.price).toLocaleString('es-UY')}</span>
                <span className="cart__item-meta">Talle: {item.size}</span>
                <span className="cart__item-meta">Color: <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: item.color, verticalAlign: 'middle', marginLeft: 4 }} /></span>
              </div>
            </div>

            <div className="cart__item-qty">
              <button onClick={() => updateQuantity(item.id, item.size, item.color, -1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.size, item.color, 1)}>+</button>
              <button className="cart__item-remove" onClick={() => removeItem(item.id, item.size, item.color)}>🗑</button>
            </div>

            <span className="cart__item-total">
              ${Math.round(item.price * item.quantity).toLocaleString('es-UY')}
            </span>
          </div>
        ))}
      </div>

      <div className="cart__footer">
        <div className="cart__summary">
          <div className="cart__total-row">
            <span>Total estimado:</span>
            <span className="cart__total-amount">${Math.round(total).toLocaleString('es-UY')}</span>
          </div>
          <button className="cart__checkout-btn" onClick={() => setShowCheckout(true)}>
            Finalizar compra
          </button>
        </div>
      </div>

      {showCheckout && (
        <div className="checkout-overlay" onClick={() => setShowCheckout(false)}>
          <div className="checkout-modal" onClick={e => e.stopPropagation()}>
            <button className="checkout-modal__close" onClick={() => setShowCheckout(false)}>×</button>
            <h2 className="checkout-modal__title">Datos de pago</h2>
            <form className="checkout-modal__form" onSubmit={handleCheckoutSubmit}>
              <div className="checkout-modal__field">
                <label>Número de tarjeta</label>
                <input
                  name="number"
                  value={card.number}
                  onChange={handleCardChange}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              <div className="checkout-modal__field">
                <label>Nombre en la tarjeta</label>
                <input
                  name="name"
                  value={card.name}
                  onChange={handleCardChange}
                  placeholder="NOMBRE APELLIDO"
                  required
                />
              </div>
              <div className="checkout-modal__row">
                <div className="checkout-modal__field">
                  <label>Vencimiento</label>
                  <input
                    name="expiry"
                    value={card.expiry}
                    onChange={handleCardChange}
                    placeholder="MM/AA"
                    required
                  />
                </div>
                <div className="checkout-modal__field">
                  <label>CVV</label>
                  <input
                    name="cvv"
                    value={card.cvv}
                    onChange={handleCardChange}
                    placeholder="123"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="checkout-modal__submit">
                Confirmar compra — ${Math.round(total).toLocaleString('es-UY')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
