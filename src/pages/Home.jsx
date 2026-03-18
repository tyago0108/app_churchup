import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { Link } from 'react-router-dom'

export default function Home({ session }) {
  const [aoVivo, setAoVivo] = useState([])
  const [proximos, setProximos] = useState([])
  const [passados, setPassados] = useState([])

  useEffect(() => {
    loadEventos()
  }, [])

  async function loadEventos() {
    const { data, error } = await supabase
      .from('eventos')
      .select('*, igrejas(nome)')

    if (error) {
      console.log(error)
      return
    }

    if (!data) return

    processarEventos(data)
  }

  function processarEventos(lista) {
    const agora = new Date()

    const aoVivoTemp = []
    const proximosTemp = []
    const passadosTemp = []

    lista.forEach((evento) => {
      const dataRaw = evento.data || evento.data_inicio

      if (!dataRaw) {
        proximosTemp.push(evento)
        return
      }

      const dataEvento = new Date(dataRaw)
      const fimEvento = new Date(dataEvento.getTime() + 2 * 60 * 60 * 1000)

      if (agora >= dataEvento && agora <= fimEvento) {
        aoVivoTemp.push(evento)
      } else if (dataEvento > agora) {
        proximosTemp.push(evento)
      } else {
        passadosTemp.push(evento)
      }
    })

    setAoVivo(aoVivoTemp)
    setProximos(proximosTemp)
    setPassados(passadosTemp)
  }

  function renderCard(evento, estilo) {
    const dataRaw = evento.data || evento.data_inicio

    return (
      <Link to={`/evento/${evento.id}`} key={evento.id} style={link}>
        <div style={{ ...cardBase, ...estilo }}>

          {/* IMAGEM 9:16 */}
          <div style={imageWrapper}>
            <img
              src={evento.foto_capa || '#'}
              alt=""
              style={image}
            />
          </div>

          {/* CONTEÚDO */}
          <div style={cardContent}>

            <small style={igreja}>
              {evento.igrejas?.nome || 'Igreja não informada'}
            </small>

            <h3 style={titulo}>{evento.titulo}</h3>

            <p style={desc}>
              {evento.descricao}
            </p>

            {dataRaw && (
              <small style={date}>
                {new Date(dataRaw).toLocaleString()}
              </small>
            )}

          </div>
        </div>
      </Link>
    )
  }

  return (
    <div style={container}>

      {/* HEADER */}
      <div style={header}>
        <h1 style={logo}>ChurchUp</h1>
      </div>

      <div style={content}>

        <section>
          <h2 style={title}>Ao vivo agora</h2>
          {aoVivo.length === 0 && <p style={empty}>Nenhum evento ao vivo</p>}
          <div style={grid}>{aoVivo.map((e) => renderCard(e, cardLive))}</div>
        </section>

        <section>
          <h2 style={title}>Próximos eventos</h2>
          {proximos.length === 0 && <p style={empty}>Nenhum evento futuro</p>}
          <div style={grid}>{proximos.map((e) => renderCard(e, card))}</div>
        </section>

        <section>
          <h2 style={title}>Eventos anteriores</h2>
          {passados.length === 0 && <p style={empty}>Nenhum evento passado</p>}
          <div style={grid}>{passados.map((e) => renderCard(e, cardPast))}</div>
        </section>

      </div>
    </div>
  )
}

// 🎨 ESTILO DARK FIXO + CONTROLE DE ALTURA

const container = {
  background: '#0f172a',
  minHeight: '100vh'
}

const header = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 24px',
  borderBottom: '1px solid #1e293b'
}

const logo = {
  fontSize: 18,
  fontWeight: 600,
  color: '#f8fafc'
}

const content = {
  padding: 24,
  maxWidth: 1200,
  margin: '0 auto'
}

const title = {
  fontSize: 16,
  fontWeight: 600,
  marginBottom: 12,
  color: '#f1f5f9'
}

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 16
}

const link = {
  textDecoration: 'none'
}

const cardBase = {
  borderRadius: 10,
  overflow: 'hidden',
  border: '1px solid #1e293b',
  background: '#020617'
}

const card = {}

const cardLive = {
  border: '1px solid #ef4444'
}

const cardPast = {
  opacity: 0.5
}

// proporção 9:16
const imageWrapper = {
  position: 'relative',
  width: '100%',
  paddingTop: '177%'
}

const image = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover'
}

const cardContent = {
  padding: 12
}

const igreja = {
  fontSize: 11,
  color: '#94a3b8'
}

const titulo = {
  fontSize: 14,
  fontWeight: 600,
  margin: '4px 0',
  color: '#f8fafc'
}

const desc = {
  fontSize: 13,
  color: '#cbd5f5',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}

const date = {
  display: 'block',
  marginTop: 4,
  fontSize: 11,
  color: '#64748b'
}

const empty = {
  fontSize: 13,
  color: '#64748b'
}