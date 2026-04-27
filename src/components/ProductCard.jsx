import React from 'react'
import { Link } from 'react-router-dom'
import './ProductCard.css'

export default function ProductCard({ product }) {
  return (
    <Link to={`/productos/${product.id}`} className="product-card">
      <div className="product-card__image-wrap">
        <img
          src={product.images[0]}
          alt={product.name}
          className="product-card__image"
          loading="lazy"
        />
      </div>
      <div className="product-card__info">
        <span className="product-card__category">{product.category}</span>
        <span className="product-card__name">{product.name}</span>
        <span className="product-card__price">
          ${Math.round(product.price).toLocaleString('es-UY')}
        </span>
      </div>
    </Link>
  )
}
