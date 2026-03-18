import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'

export default function ChurchPage() {
  const { id } = useParams()

  const [igreja, setIgreja] = useState(null)
  const [eventos, setEventos] = useState([])

  useEffect(() => {
    loadChurch()
    loadEventos()
  }, [])

  async function loadChurch() {
    const { data } = await supabase
      .from('igrejas')
      .select('*')
      .eq('id', id)
      .single()

    setIgreja(data)
  }

  async function loadEventos() {
    const { data } = await supabase
      .from('eventos')
      .select('*')
      .eq('igreja_id', id)
      .order('data', { ascending: true })

    setEventos(data)
  }

  if (!igreja) return <p style={{ padding: 20 }}>Carregando...</p>

  return (
    <div style={container}>

      {/* CAPA */}
      <div style={capa}>
        <img
          src={igreja.foto_capa || '/fallback.jpg'}
          style={capaImg}
          onError={(e) => (e.target.src = '/fallback.jpg')}
        />
      </div>

      {/* PERFIL */}
      <div style={perfilBox}>

        <img
          src={igreja.foto_perfil || '/fallback.jpg'}
          style={perfilImg}
          onError={(e) => (e.target.src = '/fallback.jpg')}
        />

        <h1>{igreja.nome}</h1>

        <p style={info}>{igreja.endereco}</p>

        {igreja.telefone && (
          <p style={info}>📞 {igreja.telefone}</p>
        )}

        {/* INSTAGRAM */}
        {igreja.instagram && (
          <a href={igreja.instagram} target="_blank">
            <button style={btn}>Instagram</button>
          </a>
        )}

      </div>

      {/* EVENTOS */}
      <div style={eventosBox}>
        <h2>Eventos</h2>

        {eventos.length === 0 && <p>Nenhum evento ainda</p>}

        <div style={grid}>
          {eventos.map((evento) => (
            <div key={evento.id} style={card}>

              <img
                src={evento.foto_capa || '/fallback.jpg'}
                style={imgEvento}
                onError={(e) => (e.target.src = '/fallback.jpg')}
              />

              <h4>{evento.titulo}</h4>

              <small>
                {new Date(evento.data).toLocaleString()}
              </small>

            </div>
          ))}
        </div>

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

const capa = {
  height: 200,
  overflow: 'hidden'
}

const capaImg = {
  width: '100%',
  height: '100%',
  objectFit: 'cover'
}

const perfilBox = {
  textAlign: 'center',
  marginTop: -50,
  padding: 20
}

const perfilImg = {
  width: 100,
  height: 100,
  borderRadius: '50%',
  border: '4px solid #0f172a',
  objectFit: 'cover'
}

const info = {
  color: '#94a3b8'
}

const btn = {
  marginTop: 10,
  background: 'orange',
  border: 'none',
  padding: '8px 14px',
  borderRadius: 8,
  cursor: 'pointer'
}

const eventosBox = {
  padding: 20
}

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: 20
}

const card = {
  background: '#1e293b',
  padding: 10,
  borderRadius: 10
}

const imgEvento = {
  width: '100%',
  height: 120,
  objectFit: 'cover',
  borderRadius: 6
}