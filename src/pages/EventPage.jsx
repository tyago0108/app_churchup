import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'

export default function EventPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [evento, setEvento] = useState(null)

  useEffect(() => {
    loadEvento()
  }, [])

  async function loadEvento() {
    const { data, error } = await supabase
      .from('eventos')
      .select('*, igrejas(nome)')
      .eq('id', id)
      .single()

    if (error) {
      console.log(error)
      return
    }

    setEvento(data)
  }

  if (!evento) {
    return <p style={{ padding: 20 }}>Carregando evento...</p>
  }

  return (
    <div style={container}>

      {/* HERO (IMAGEM + OVERLAY) */}
      <div style={hero}>
        <img
          src={evento.foto_capa || '/fallback.jpg'}
          alt=""
          style={image}
          onError={(e) => (e.target.src = '/fallback.jpg')}
        />

        <div style={overlay} />

        {/* BOTÃO VOLTAR */}
        <button onClick={() => navigate(-1)} style={btnVoltar}>
          ← Voltar
        </button>

        {/* TEXTO SOBRE IMAGEM */}
        <div style={heroContent}>
          <small style={igreja}>
            {evento.igrejas?.nome || 'Igreja não informada'}
          </small>

          <h1 style={titulo}>{evento.titulo}</h1>

          <p style={date}>
            {new Date(evento.data).toLocaleString()}
          </p>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div style={content}>
        <h2>Sobre o evento</h2>

        <p style={desc}>
          {evento.descricao || 'Sem descrição disponível'}
        </p>

        {/* BOTÃO FUTURO (INSCRIÇÃO) */}
        <button style={cta}>
          Quero participar
        </button>
      </div>

    </div>
  )
}

//
// 🎨 ESTILO
//

const container = {
  background: '#0f172a',
  minHeight: '100vh',
  color: '#fff'
}

const hero = {
  position: 'relative',
  height: 350,
  overflow: 'hidden'
}

const image = {
  width: '100%',
  height: '100%',
  objectFit: 'cover'
}

const overlay = {
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(to top, #020617, transparent)'
}

const heroContent = {
  position: 'absolute',
  bottom: 20,
  left: 20
}

const btnVoltar = {
  position: 'absolute',
  top: 20,
  left: 20,
  background: '#020617',
  border: '1px solid #334155',
  color: '#fff',
  padding: '6px 10px',
  borderRadius: 6,
  cursor: 'pointer'
}

const igreja = {
  color: '#94a3b8'
}

const titulo = {
  marginTop: 5
}

const date = {
  marginTop: 5,
  color: '#cbd5f5'
}

const content = {
  padding: 25,
  maxWidth: 800,
  margin: '0 auto'
}

const desc = {
  marginTop: 10,
  lineHeight: 1.6,
  color: '#cbd5f5'
}

const cta = {
  marginTop: 20,
  background: 'orange',
  border: 'none',
  padding: '10px 16px',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 'bold'
}