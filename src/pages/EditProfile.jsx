import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import './EditProfile.css'

export default function EditProfile() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    zip_code: '',
    address: '',
  })

  useEffect(() => {
    api.getProfile().then(data => {
      setForm(f => ({
        ...f,
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        zip_code: data.zip_code || '',
        address: data.address || '',
      }))
    })
  }, [])

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    await api.updateProfile({ name: form.name, email: form.email, phone: form.phone, zip_code: form.zip_code, address: form.address })
    navigate('/perfil')
  }

  return (
    <div className="edit-profile">
      <h1 className="edit-profile__title">Editar perfil</h1>

      <form className="edit-profile__form" onSubmit={handleSubmit}>
        <div className="edit-profile__field edit-profile__field--full">
          <label>Nombre y Apellido:</label>
          <input name="name" value={form.name} onChange={handleChange} />
        </div>

        <div className="edit-profile__row">
          <div className="edit-profile__field">
            <label>Mail:</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} />
          </div>
          <div className="edit-profile__field">
            <label>Teléfono:</label>
            <input name="phone" value={form.phone} onChange={handleChange} />
          </div>
        </div>

        <div className="edit-profile__field edit-profile__field--full">
          <label>Contraseña:</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" />
        </div>

        <div className="edit-profile__field edit-profile__field--full">
          <label>Repetir contraseña:</label>
          <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" />
        </div>

        <div className="edit-profile__row">
          <div className="edit-profile__field">
            <label>Código Postal:</label>
            <input name="zip_code" value={form.zip_code} onChange={handleChange} />
          </div>
          <div className="edit-profile__field">
            <label>Dirección:</label>
            <input name="address" value={form.address} onChange={handleChange} />
          </div>
        </div>

        <button type="submit" className="edit-profile__submit-btn">
          Guardar
        </button>
      </form>
    </div>
  )
}
