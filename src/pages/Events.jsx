import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { uploadImagem } from '../services/uploadImage'

export default function Events() {
  const [igrejas, setIgrejas] = useState([])
  const [eventos, setEventos] = useState([])

  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [data, setData] = useState('')
  const [igrejaId, setIgrejaId] = useState(null)

  const [imagem, setImagem] = useState(null)
  const [preview, setPreview] = useState(null)

  const [editando, setEditando] = useState(null)

  useEffect(() => {
    loadChurches()
    loadEventos()
  }, [])

  // 🔹 CARREGA IGREJAS DO USUÁRIO
  async function loadChurches() {
    const { data: userData } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('igrejas')
      .select('*')
      .eq('user_id', userData.user.id)

    if (error) {
      console.log(error)
      return
    }

    setIgrejas(data)
  }

  // 🔥 CARREGA APENAS EVENTOS DAS IGREJAS DO USUÁRIO
  async function loadEventos() {
    const { data: userData } = await supabase.auth.getUser()

    // pega igrejas do usuário
    const { data: igrejas, error: erroIgrejas } = await supabase
      .from('igrejas')
      .select('id')
      .eq('user_id', userData.user.id)

    if (erroIgrejas) {
      console.log(erroIgrejas)
      return
    }

    if (!igrejas || igrejas.length === 0) {
      setEventos([])
      return
    }

    const ids = igrejas.map(i => i.id)

    // busca eventos dessas igrejas
    const { data, error } = await supabase
      .from('eventos')
      .select('*')
      .in('igreja_id', ids)
      .order('data', { ascending: false })

    if (error) {
      console.log(error)
      return
    }

    setEventos(data)
  }

  // 🔹 IMAGEM
  function handleImage(e) {
    const file = e.target.files[0]
    setImagem(file)

    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  // 🔹 RESET
  function resetForm() {
    setTitulo('')
    setDescricao('')
    setData('')
    setIgrejaId(null)
    setImagem(null)
    setPreview(null)
    setEditando(null)
  }

  // 🔹 CREATE
  async function handleCreate() {
    if (!igrejaId) return alert('Selecione uma igreja')

    let urlImagem = null

    if (imagem) {
      urlImagem = await uploadImagem(imagem)
    }

    const { error } = await supabase.from('eventos').insert([
      {
        titulo,
        descricao,
        data,
        igreja_id: igrejaId,
        foto_capa: urlImagem,
        aprovado: false // 🔥 importante para moderação
      }
    ])

    if (error) {
      alert(error.message)
    } else {
      resetForm()
      loadEventos()
    }
  }

  // 🔹 UPDATE
  async function handleUpdate() {
    let urlImagem = null

    if (imagem) {
      urlImagem = await uploadImagem(imagem)
    }

    const updateData = {
      titulo,
      descricao,
      data,
      igreja_id: igrejaId
    }

    if (urlImagem) {
      updateData.foto_capa = urlImagem
    }

    const { error } = await supabase
      .from('eventos')
      .update(updateData)
      .eq('id', editando)

    if (error) {
      alert(error.message)
    } else {
      resetForm()
      loadEventos()
    }
  }

  // 🔹 CARREGAR EDIÇÃO
  function carregarEdicao(evento) {
    setEditando(evento.id)
    setTitulo(evento.titulo)
    setDescricao(evento.descricao)
    setData(evento.data)
    setIgrejaId(evento.igreja_id)
    setPreview(evento.foto_capa)
  }

  // 🔹 DELETE
  async function handleDelete(id) {
    if (!confirm('Deseja excluir esse evento?')) return

    const { error } = await supabase
      .from('eventos')
      .delete()
      .eq('id', id)

    if (error) {
      alert(error.message)
    } else {
      loadEventos()
    }
  }

  return (
    <div style={container}>

      <h2>{editando ? 'Editar Evento' : 'Criar Evento'}</h2>

      {/* FORM */}
      <div style={form}>

        <select value={igrejaId || ''} onChange={(e) => setIgrejaId(e.target.value)}>
          <option value="">Selecione a igreja</option>
          {igrejas.map((i) => (
            <option key={i.id} value={i.id}>
              {i.nome}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <input
          type="datetime-local"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />

        <textarea
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <input type="file" accept="image/*" onChange={handleImage} />

        {preview && (
          <img src={preview} alt="" style={previewImg} />
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={editando ? handleUpdate : handleCreate}>
            {editando ? 'Atualizar' : 'Criar'}
          </button>

          {editando && (
            <button onClick={resetForm}>
              Cancelar
            </button>
          )}
        </div>

      </div>

      {/* LISTA */}
      <h3>Seus eventos</h3>

      <div style={grid}>
        {eventos.map((evento) => (
          <div key={evento.id} style={card}>

            {evento.foto_capa && (
              <img src={evento.foto_capa} alt="" style={image} />
            )}

            <h4>{evento.titulo}</h4>
            <p>{evento.descricao}</p>

            <small>
              {new Date(evento.data).toLocaleString()}
            </small>

            {!evento.aprovado && (
              <p style={{ color: 'orange', fontSize: 12 }}>
                ⏳ Aguardando aprovação
              </p>
            )}

            <div style={actions}>
              <button onClick={() => carregarEdicao(evento)}>
                Editar
              </button>

              <button onClick={() => handleDelete(evento.id)}>
                Excluir
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}

//
// 🎨 ESTILO
//

const container = {
  padding: 20,
  color: '#fff'
}

const form = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  marginBottom: 30,
  maxWidth: 400
}

const previewImg = {
  width: 200,
  borderRadius: 8
}

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: 20
}

const card = {
  background: '#1e293b',
  padding: 15,
  borderRadius: 10
}

const image = {
  width: '100%',
  height: 120,
  objectFit: 'cover',
  borderRadius: 6
}

const actions = {
  marginTop: 10,
  display: 'flex',
  gap: 10
}