import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'
import CosmosLogo from '../components/CosmosLogo'
import './Auth.css'

export default function Auth() {
  const [tab, setTab] = useState('login')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    name: '', email: '', password: '', password_confirmation: '',
    phone: '', address: '', zip_code: '',
  })

  function handleLoginChange(e) {
    setLoginForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleRegisterChange(e) {
    setRegisterForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleLogin(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = await api.login(loginForm.email, loginForm.password)
      login(data.token, data.user)
      navigate('/perfil')
    } catch (err) {
      setError(err.errors || 'Email o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = await api.register(registerForm)
      login(data.token, data.user)
      navigate('/perfil')
    } catch (err) {
      setError(Array.isArray(err.errors) ? err.errors.join(', ') : err.errors)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth">

      <div className="auth__card">
        <div className="auth__tabs">
          <button
            className={`auth__tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setError(null) }}
          >
            Iniciar sesión
          </button>
          <button
            className={`auth__tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => { setTab('register'); setError(null) }}
          >
            Registrarse
          </button>
        </div>

        {error && <p className="auth__error">{error}</p>}

        {tab === 'login' ? (
          <form className="auth__form" onSubmit={handleLogin}>
            <div className="auth__field">
              <label>Mail:</label>
              <input name="email" type="email" value={loginForm.email} onChange={handleLoginChange} required />
            </div>
            <div className="auth__field">
              <label>Contraseña:</label>
              <input name="password" type="password" value={loginForm.password} onChange={handleLoginChange} required />
            </div>
            <button className="auth__submit" type="submit" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        ) : (
          <form className="auth__form" onSubmit={handleRegister}>
            <div className="auth__field">
              <label>Nombre y Apellido:</label>
              <input name="name" value={registerForm.name} onChange={handleRegisterChange} required />
            </div>
            <div className="auth__row">
              <div className="auth__field">
                <label>Mail:</label>
                <input name="email" type="email" value={registerForm.email} onChange={handleRegisterChange} required />
              </div>
              <div className="auth__field">
                <label>Teléfono:</label>
                <input name="phone" value={registerForm.phone} onChange={handleRegisterChange} />
              </div>
            </div>
            <div className="auth__row">
              <div className="auth__field">
                <label>Contraseña:</label>
                <input name="password" type="password" value={registerForm.password} onChange={handleRegisterChange} required />
              </div>
              <div className="auth__field">
                <label>Repetir contraseña:</label>
                <input name="password_confirmation" type="password" value={registerForm.password_confirmation} onChange={handleRegisterChange} required />
              </div>
            </div>
            <div className="auth__row">
              <div className="auth__field">
                <label>Dirección:</label>
                <input name="address" value={registerForm.address} onChange={handleRegisterChange} />
              </div>
              <div className="auth__field">
                <label>Código Postal:</label>
                <input name="zip_code" value={registerForm.zip_code} onChange={handleRegisterChange} />
              </div>
            </div>
            <button className="auth__submit" type="submit" disabled={loading}>
              {loading ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
