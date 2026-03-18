import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { Link } from 'react-router-dom'

export default function ChurchesPage() {
  const [igrejas, setIgrejas] = useState([])

  const [busca, setBusca] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')

  useEffect(() => {
    loadChurches()
  }, [busca, cidade, estado])

  async function loadChurches() {
    let query = supabase.from('igrejas').select('*')

    if (busca) query = query.ilike('nome', `%${busca}%`)
    if (cidade) query = query.ilike('cidade', `%${cidade}%`)
    if (estado) query = query.ilike('estado', `%${estado}%`)

    const { data, error } = await query

    if (error) {
      console.log(error)
      return
    }

    setIgrejas(data)
  }

  return (
    <div style={container}>

      <h1 style={title}>Explorar Igrejas</h1>

      {/* 🔍 FILTROS */}
      <div style={filters}>

        <input
          style={input}
          placeholder="🔍 Nome da igreja"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        <input
          style={input}
          placeholder="📍 Cidade"
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
        />

        <input
          style={input}
          placeholder="🌎 Estado (SP, RJ...)"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        />

      </div>

      {/* 📦 GRID */}
      <div style={grid}>
        {igrejas.map((igreja) => (
          <div key={igreja.id} style={card}>

            {/* IMAGEM */}
            <img
              src={igreja.foto_capa || '/fallback.jpg'}
              style={image}
              onError={(e) => (e.target.src = '/fallback.jpg')}
            />

            {/* CONTEÚDO */}
            <div style={cardContent}>

              <h3 style={nome}>{igreja.nome}</h3>

              <p style={local}>
                📍 {igreja.cidade} - {igreja.estado}
              </p>

              <Link to={`/igreja/${igreja.id}`}>
                <button style={btn}>
                  Ver igreja
                </button>
              </Link>

            </div>

          </div>
        ))}
      </div>

      {igrejas.length === 0 && (
        <p style={empty}>Nenhuma igreja encontrada</p>
      )}

    </div>
  )
}

//
// 🎨 ESTILO PROFISSIONAL
//

const container = {
  padding: '40px 20px',
  background: '#020617',
  minHeight: '100vh',
  color: '#fff'
}

const title = {
  marginBottom: 25,
  fontSize: 28,
  fontWeight: 'bold'
}

const filters = {
  display: 'flex',
  gap: 15,
  marginBottom: 30,
  flexWrap: 'wrap'
}

const input = {
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #334155',
  background: '#0f172a',
  color: '#fff',
  minWidth: 220,
  outline: 'none'
}

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: 25
}

const card = {
  background: '#0f172a',
  borderRadius: 14,
  overflow: 'hidden',
  border: '1px solid #1e293b',
  transition: '0.2s',
  cursor: 'pointer'
}

const image = {
  width: '100%',
  height: 160,
  objectFit: 'cover'
}

const cardContent = {
  padding: 15,
  display: 'flex',
  flexDirection: 'column',
  gap: 8
}

const nome = {
  fontSize: 18,
  fontWeight: 'bold'
}

const local = {
  fontSize: 14,
  color: '#94a3b8'
}

const btn = {
  marginTop: 10,
  background: 'orange',
  border: 'none',
  padding: '8px 12px',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 'bold'
}

const empty = {
  marginTop: 30,
  color: '#94a3b8'
}