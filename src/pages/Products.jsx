import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import ProductCard from '../components/ProductCard'
import './Products.css'

const categories = ['Camperas', 'Buzos']

export default function Products() {
  const { isAdmin } = useAuth()
  const [selected, setSelected] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteMode, setDeleteMode] = useState(false)
  const [toDelete, setToDelete] = useState([])

  useEffect(() => {
    setLoading(true)
    api.getProducts(selected)
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [selected])

  function toggleSelect(id) {
    setToDelete(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  async function handleDelete() {
    if (!toDelete.length) return
    await Promise.all(toDelete.map(id => api.deleteProduct(id)))
    setProducts(prev => prev.filter(p => !toDelete.includes(p.id)))
    setToDelete([])
    setDeleteMode(false)
  }

  return (
    <div className="products">
      <div className={`products__header${isAdmin ? ' products__header--admin' : ''}`}>
        <h1 className="products__title">Productos</h1>
        {isAdmin && (
          <div className="products__admin-btns">
            <Link to="/productos/nuevo" className="products__add-btn">+ Agregar producto</Link>
            <button
              className={`products__delete-btn ${deleteMode ? 'active' : ''}`}
              onClick={() => { setDeleteMode(d => !d); setToDelete([]) }}
            >
              {deleteMode ? 'Cancelar' : '- Eliminar producto'}
            </button>
            {deleteMode && toDelete.length > 0 && (
              <button className="products__confirm-delete-btn" onClick={handleDelete}>
                Confirmar ({toDelete.length})
              </button>
            )}
          </div>
        )}
      </div>

      <div className="products__layout">
        <aside className="products__sidebar">
          <ul className="products__filter-list">
            {categories.map(cat => (
              <li key={cat}>
                <button
                  className={`products__filter-btn ${selected === cat ? 'active' : ''}`}
                  onClick={() => setSelected(cat === selected ? null : cat)}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="products__grid">
          {loading
            ? <p className="products__loading">Cargando...</p>
            : products.map(product => (
                deleteMode
                  ? (
                    <div
                      key={product.id}
                      className={`products__selectable ${toDelete.includes(product.id) ? 'selected' : ''}`}
                    >
                      <ProductCard product={product} />
                      <div className="products__select-interceptor" onClick={() => toggleSelect(product.id)}>
                        {toDelete.includes(product.id) && <span className="products__selected-overlay">✓</span>}
                      </div>
                    </div>
                  )
                  : <ProductCard key={product.id} product={product} />
              ))
          }
        </main>
      </div>
    </div>
  )
}
