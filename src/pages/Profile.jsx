import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'
import './Profile.css'

export default function Profile() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    api.getProfile().then(setUser)
  }, [])

  function handleLogout() {
    logout()
    navigate('/')
  }

  if (!user) return <div className="profile__loading">Cargando...</div>

  return (
    <div className="profile">
      <h1 className="profile__title">Perfil</h1>

      <div className="profile__fields">
        <div className="profile__field profile__field--full">
          <label>Nombre y Apellido:</label>
          <div className="profile__value">{user.name}</div>
        </div>

        <div className="profile__row">
          <div className="profile__field">
            <label>Mail:</label>
            <div className="profile__value">{user.email}</div>
          </div>
          <div className="profile__field">
            <label>Teléfono:</label>
            <div className="profile__value">{user.phone || '—'}</div>
          </div>
        </div>

        <div className="profile__field profile__field--full">
          <label>Contraseña:</label>
          <div className="profile__value">••••••••</div>
        </div>

        <div className="profile__row">
          <div className="profile__field">
            <label>Dirección:</label>
            <div className="profile__value">{user.address || '—'}</div>
          </div>
          <div className="profile__field">
            <label>Código Postal:</label>
            <div className="profile__value">{user.zip_code || '—'}</div>
          </div>
        </div>
      </div>

      <div className="profile__actions">
        <Link to="/perfil/editar" className="profile__edit-btn">
          Editar
        </Link>
        <button className="profile__logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
