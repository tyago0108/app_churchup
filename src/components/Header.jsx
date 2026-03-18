import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'

export default function Header({ session }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <header style={header}>

      {/* LOGO */}
      <Link to="/Home" style={logo}>
        ChurchUp
      </Link>

      {/* MENU */}
      <div style={menu}>
        <Link to="/Home" style={link}>Home</Link>
        <Link to="/igrejas" style={link}>Igrejas</Link>
        <Link to="/sobre" style={link}>Sobre</Link>

        {/* 🔓 DESLOGADO */}
        {!session && (
          <Link to="/login">
            <button style={btn}>Entrar</button>
          </Link>
        )}

        {/* 🔒 LOGADO */}
        {session && (
          <div style={userBox}>
            
            <button style={btn} onClick={() => setOpen(!open)}>
              👤 Perfil
            </button>

            {open && (
  <div style={dropdown}>

    <Link to="/perfil" style={item} onClick={() => setOpen(false)}>
      Perfil
    </Link>

    <Link to="/meus-eventos" style={item} onClick={() => setOpen(false)}>
      Meus Eventos
    </Link>

    <Link to="/minhas-igrejas" style={item} onClick={() => setOpen(false)}>
      Minhas Igrejas
    </Link>

    <div style={divider} />

    <button onClick={handleLogout} style={logout}>
      Sair
    </button>

  </div>
)}
          </div>
        )}

      </div>
    </header>
  )
}

//
// 🎨 ESTILO
//

const header = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '15px 25px',
  background: '#020617',
  borderBottom: '1px solid #1e293b',
  color: '#fff'
}

const logo = {
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: 22
}

const menu = {
  display: 'flex',
  alignItems: 'center',
  gap: 15
}

const link = {
  color: '#cbd5f5',
  textDecoration: 'none'
}

const btn = {
  background: 'orange',
  border: 'none',
  padding: '6px 12px',
  borderRadius: 6,
  cursor: 'pointer',
  fontWeight: 'bold'
}

const userBox = {
  position: 'relative'
}

const dropdown = {
  position: 'absolute',
  top: 40,
  right: 0,
  background: '#0f172a',
  border: '1px solid #1e293b',
  borderRadius: 8,
  padding: 10,
  display: 'flex',
  flexDirection: 'column',
  minWidth: 180,
  zIndex: 100
}

const item = {
  color: '#fff',
  textDecoration: 'none',
  padding: 8,
  borderRadius: 6
}

const logout = {
  background: 'none',
  border: 'none',
  color: '#ef4444',
  padding: 8,
  textAlign: 'left',
  cursor: 'pointer'
}

const divider = {
  height: 1,
  background: '#1e293b',
  margin: '5px 0'
}