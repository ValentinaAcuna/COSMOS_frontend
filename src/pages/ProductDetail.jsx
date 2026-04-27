import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/client'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './ProductDetail.css'

export default function ProductDetail() {
  const { id } = useParams()
  const { addItem } = useCart()
  const { isAdmin, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imgIndex, setImgIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [added, setAdded] = useState(false)
  const [zoomed, setZoomed] = useState(false)

  useEffect(() => {
    api.getProduct(id)
      .then(setProduct)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="product-detail__not-found">Cargando...</div>
  if (!product) return <div className="product-detail__not-found">Producto no encontrado</div>

  function handleAdd() {
    if (!isLoggedIn) return navigate('/login')
    if (!selectedSize || !selectedColor) return
    addItem(product, selectedSize, selectedColor)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  function prev() {
    setImgIndex(i => (i - 1 + product.images.length) % product.images.length)
  }

  function next() {
    setImgIndex(i => (i + 1) % product.images.length)
  }

  return (
    <div className="product-detail">
      <div className="product-detail__image-section">
        <button className="product-detail__arrow product-detail__arrow--left" onClick={prev}>‹</button>
        <img
          src={product.images[imgIndex]}
          alt={product.name}
          className="product-detail__image"
        />
        <button className="product-detail__arrow product-detail__arrow--right" onClick={next}>›</button>
        <button className="product-detail__zoom" aria-label="Ampliar" onClick={() => setZoomed(true)}>+</button>
      </div>

      {zoomed && (
        <div className="product-detail__lightbox" onClick={() => setZoomed(false)}>
          <img src={product.images[imgIndex]} alt={product.name} className="product-detail__lightbox-img" />
        </div>
      )}

      <div className="product-detail__info">
        <h1 className="product-detail__name">{product.name}</h1>

        <div className="product-detail__colors-section">
          <p className="product-detail__label">Colores disponibles:</p>
          <div className="product-detail__colors">
            {product.colors.map(color => (
              <button
                key={color}
                className={`product-detail__color-swatch ${selectedColor === color ? 'active' : ''}`}
                style={{ background: color }}
                onClick={() => setSelectedColor(color)}
                aria-label={color}
              />
            ))}
          </div>
        </div>

        <div className="product-detail__sizes-section">
          <div className="product-detail__sizes">
            {product.sizes.map(size => (
              <button
                key={size}
                className={`product-detail__size-btn ${selectedSize === size ? 'active' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {!isAdmin && (
          <button
            className={`product-detail__add-btn ${(isLoggedIn && (!selectedSize || !selectedColor)) ? 'disabled' : ''} ${added ? 'added' : ''}`}
            onClick={handleAdd}
            disabled={isLoggedIn && (!selectedSize || !selectedColor)}
          >
            {added ? '¡Agregado!' : 'Añadir al carrito'}
          </button>
        )}
      </div>
    </div>
  )
}
