import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import './NewProduct.css'

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const CATEGORIES = ['Camperas', 'Buzos']

export default function NewProduct() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: CATEGORIES[0],
    colors: ['#000000'],
    sizes: [],
    imageUrl: '',
  })
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function toggleSize(size) {
    setForm(f => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter(s => s !== size) : [...f.sizes, size]
    }))
  }

  function handleColorChange(index, value) {
    setForm(f => {
      const colors = [...f.colors]
      colors[index] = value
      return { ...f, colors }
    })
  }

  function addColor() {
    setForm(f => ({ ...f, colors: [...f.colors, '#000000'] }))
  }

  function removeColor(index) {
    setForm(f => ({ ...f, colors: f.colors.filter((_, i) => i !== index) }))
  }

  function handleImageUrl(e) {
    const url = e.target.value
    setForm(f => ({ ...f, imageUrl: url }))
    setPreview(url)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await api.createProduct({
        name: form.name,
        price: parseFloat(form.price),
        category: form.category,
        colors: form.colors,
        sizes: form.sizes,
        images: form.imageUrl ? [form.imageUrl] : [],
      })
      navigate('/productos')
    } catch (err) {
      setError(err.errors || 'Error al crear el producto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="new-product">
      <div className="new-product__image-section">
        {preview
          ? <img src={preview} alt="Preview" className="new-product__image" />
          : <div className="new-product__image-placeholder">Sin imagen</div>
        }
      </div>

      <div className="new-product__info">
        <h1 className="new-product__title">Nuevo Producto</h1>

        {error && <p className="new-product__error">{error}</p>}

        <form className="new-product__form" onSubmit={handleSubmit}>
          <div className="new-product__field">
            <label>Nombre</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>

          <div className="new-product__field">
            <label>Precio ($)</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} required min="0" />
          </div>

          <div className="new-product__field">
            <label>Categoría</label>
            <select name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="new-product__field">
            <label>URL de imagen</label>
            <input name="imageUrl" value={form.imageUrl} onChange={handleImageUrl} placeholder="https://... o /images/..." />
          </div>

          <div className="new-product__field">
            <label>Colores</label>
            <div className="new-product__colors">
              {form.colors.map((color, i) => (
                <div key={i} className="new-product__color-row">
                  <input type="color" value={color} onChange={e => handleColorChange(i, e.target.value)} />
                  <span>{color}</span>
                  {form.colors.length > 1 && (
                    <button type="button" onClick={() => removeColor(i)} className="new-product__remove-color">✕</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addColor} className="new-product__add-color">+ Color</button>
            </div>
          </div>

          <div className="new-product__field">
            <label>Talles</label>
            <div className="new-product__sizes">
              {ALL_SIZES.map(size => (
                <button
                  key={size}
                  type="button"
                  className={`new-product__size-btn ${form.sizes.includes(size) ? 'active' : ''}`}
                  onClick={() => toggleSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="new-product__submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Crear producto'}
          </button>
        </form>
      </div>
    </div>
  )
}
