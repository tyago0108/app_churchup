import { useEffect, useState } from 'react'
import { supabase } from './services/supabaseClient'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Header from './components/Header'

// 🌐 PÁGINAS PÚBLICAS
import Home from './pages/Home'
import Login from './pages/Login'
import Landing from './pages/Landing'
import ChurchesPage from './pages/ChurchesPage'
import ChurchPage from './pages/ChurchPage'
import EventPage from './pages/EventPage'

// 🔒 PÁGINAS INTERNAS (LOGADO)
import Profile from './pages/Profile'
import Events from './pages/Events'
import Churches from './pages/Churches'
import Admin from './pages/Admin'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSession() {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      setLoading(false)
    }

    loadSession()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  // 🔥 evita render quebrado antes de carregar sessão
  if (loading) return null

  return (
    <BrowserRouter>

      {/* HEADER GLOBAL */}
      <Header session={session} />

      <Routes>

        {/* 🌐 PÚBLICAS */}
        {/* HOME PRINCIPAL */}
        <Route path="/" element={<Home session={session} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sobre" element={<Landing />} />
        <Route path="/igrejas" element={<ChurchesPage />} />
        <Route path="/igreja/:id" element={<ChurchPage />} />
        <Route path="/evento/:id" element={<EventPage />} />

        {/* 🔒 PROTEGIDAS */}
        {session && (
          <>
            <Route path="/perfil" element={<Profile />} />
            <Route path="/meus-eventos" element={<Events />} />
            <Route path="/minhas-igrejas" element={<Churches />} />
            <Route path="/admin" element={<Admin />} />
          </>
        )}

      </Routes>
    </BrowserRouter>
  )
}

export default App