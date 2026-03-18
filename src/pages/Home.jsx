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
      <Link to={`/evento/${evento.id}`} key={evento.id} style={{ textDecoration: 'none' }}>
        <div style={estilo}>
          <img
            src={evento.foto_capa || '#'}
            alt=""
            style={image}
          />

          <div style={{ padding: 12 }}>
            <small style={igreja}>
              {evento.igrejas?.nome || 'Igreja não informada'}
            </small>

            <h3 style={titulo}>{evento.titulo}</h3>

            <p style={desc}>
              {evento.descricao?.slice(0, 80)}...
            </p>

            {dataRaw && (
              <small style={date}>
                {new Date(dataRaw).toLocaleString()}
              </small>
            )}

            <div style={btnVerMais}>Ver mais →</div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div style={container}>

      {/* 🔝 HEADER */}

      <div style={content}>

        {/* 🔴 AO VIVO */}
        <section>
          <h2 style={title}>🔴 Ao vivo agora</h2>
          {aoVivo.length === 0 && <p style={empty}>Nenhum evento ao vivo</p>}
          <div style={grid}>{aoVivo.map((e) => renderCard(e, cardLive))}</div>
        </section>

        {/* 📅 PRÓXIMOS */}
        <section>
          <h2 style={title}>📅 Próximos eventos</h2>
          {proximos.length === 0 && <p style={empty}>Nenhum evento futuro</p>}
          <div style={grid}>{proximos.map((e) => renderCard(e, card))}</div>
        </section>

        {/* 🕘 PASSADOS */}
        <section>
          <h2 style={title}>🕘 Eventos anteriores</h2>
          {passados.length === 0 && <p style={empty}>Nenhum evento passado</p>}
          <div style={grid}>{passados.map((e) => renderCard(e, cardPast))}</div>
        </section>

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

const header = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '15px 25px',
  background: '#020617',
  borderBottom: '1px solid #1e293b'
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

const navLink = {
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

const content = {
  padding: 25,
  maxWidth: 1200,
  margin: '0 auto'
}

const title = { marginBottom: 15 }

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: 20,
  marginBottom: 30
}

const card = {
  background: '#1e293b',
  borderRadius: 12,
  overflow: 'hidden',
  border: '1px solid #334155'
}

const cardLive = {
  background: '#7f1d1d',
  borderRadius: 12,
  overflow: 'hidden',
  border: '1px solid red'
}

const cardPast = {
  background: '#111827',
  borderRadius: 12,
  overflow: 'hidden',
  border: '1px solid #374151',
  opacity: 0.6
}

const image = {
  width: '100%',
  height: 160,
  objectFit: 'cover'
}

const igreja = {
  fontSize: 12,
  color: '#94a3b8'
}

const titulo = { color: '#fff' }

const desc = {
  fontSize: 14,
  color: '#cbd5f5'
}

const date = {
  display: 'block',
  marginTop: 8,
  fontSize: 12,
  color: '#94a3b8'
}

const btnVerMais = {
  marginTop: 10,
  color: 'orange',
  fontWeight: 'bold'
}

const empty = {
  color: '#94a3b8'
}