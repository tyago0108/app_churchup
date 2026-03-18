import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { uploadImagem } from '../services/uploadImage'

export default function Churches() {
  const [igrejas, setIgrejas] = useState([])

  const [nome, setNome] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [cep, setCep] = useState('')
  const [rua, setRua] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')
  const [numero, setNumero] = useState('')
  const [telefone, setTelefone] = useState('')

  const [fotoPerfil, setFotoPerfil] = useState(null)
  const [fotoCapa, setFotoCapa] = useState(null)

  const [previewPerfil, setPreviewPerfil] = useState(null)
  const [previewCapa, setPreviewCapa] = useState(null)

  const [editandoId, setEditandoId] = useState(null)

  useEffect(() => {
    loadChurches()
  }, [])

  async function loadChurches() {
    const { data: userData } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('igrejas')
      .select('*')
      .eq('user_id', userData.user.id)

    if (error) {
      console.log('ERRO LOAD:', error)
      return
    }

    setIgrejas(data)
  }

  // 🔥 CEP AUTOMÁTICO
  async function buscarCEP(valor) {
    const cepLimpo = valor.replace(/\D/g, '')

    if (cepLimpo.length !== 8) return

    const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
    const data = await res.json()

    setRua(data.logradouro)
    setCidade(data.localidade)
    setEstado(data.uf)
  }

  // 🔥 FORMATAR TELEFONE
  function formatarTelefone(valor) {
    let v = valor.replace(/\D/g, '')

    v = v.replace(/(\d{2})(\d)/, '($1) $2')
    v = v.replace(/(\d{5})(\d)/, '$1-$2')

    return v
  }

  // 🔹 CREATE
  async function handleCreate() {
    const { data: userData } = await supabase.auth.getUser()

    let urlPerfil = null
    let urlCapa = null

    if (fotoPerfil) urlPerfil = await uploadImagem(fotoPerfil)
    if (fotoCapa) urlCapa = await uploadImagem(fotoCapa)

    const { error } = await supabase.from('igrejas').insert([
      {
        nome,
        cnpj,
        cep,
        rua,
        cidade,
        estado,
        numero,
        telefone,
        endereco: `${rua}, ${numero} - ${cidade} - ${estado}`,
        foto_perfil: urlPerfil,
        foto_capa: urlCapa,
        user_id: userData.user.id
      }
    ])

    if (error) {
      console.log('ERRO CREATE:', error)
      alert(error.message)
      return
    }

    resetForm()
    loadChurches()
  }

  // 🔹 EDITAR
  function handleEdit(i) {
    setEditandoId(i.id)
    setNome(i.nome)
    setCnpj(i.cnpj || '')
    setCep(i.cep || '')
    setRua(i.rua || '')
    setCidade(i.cidade || '')
    setEstado(i.estado || '')
    setNumero(i.numero || '')
    setTelefone(i.telefone || '')
    setPreviewPerfil(i.foto_perfil)
    setPreviewCapa(i.foto_capa)
  }

  // 🔹 UPDATE
  async function handleUpdate() {
    let urlPerfil = previewPerfil
    let urlCapa = previewCapa

    if (fotoPerfil) urlPerfil = await uploadImagem(fotoPerfil)
    if (fotoCapa) urlCapa = await uploadImagem(fotoCapa)

    const { error } = await supabase
      .from('igrejas')
      .update({
        nome,
        cnpj,
        cep,
        rua,
        cidade,
        estado,
        numero,
        telefone,
        endereco: `${rua}, ${numero} - ${cidade} - ${estado}`,
        foto_perfil: urlPerfil,
        foto_capa: urlCapa
      })
      .eq('id', editandoId)

    if (error) {
      console.log('ERRO UPDATE:', error)
      alert(error.message)
      return
    }

    resetForm()
    loadChurches()
  }

  // 🔹 DELETE
  async function handleDelete(id) {
    if (!confirm('Excluir igreja?')) return

    const { error } = await supabase
      .from('igrejas')
      .delete()
      .eq('id', id)

    if (error) {
      console.log('ERRO DELETE:', error)
      alert(error.message)
      return
    }

    loadChurches()
  }

  function resetForm() {
    setNome('')
    setCnpj('')
    setCep('')
    setRua('')
    setCidade('')
    setEstado('')
    setNumero('')
    setTelefone('')
    setFotoPerfil(null)
    setFotoCapa(null)
    setPreviewPerfil(null)
    setPreviewCapa(null)
    setEditandoId(null)
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>{editandoId ? 'Editar Igreja' : 'Criar Igreja'}</h2>

      {/* FORM */}
      <div style={form}>
        <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />

        <input placeholder="CNPJ" value={cnpj} onChange={(e) => setCnpj(e.target.value)} />

        <input
          placeholder="CEP"
          value={cep}
          onChange={(e) => {
            setCep(e.target.value)
            buscarCEP(e.target.value)
          }}
        />

        <input placeholder="Número" value={numero} onChange={(e) => setNumero(e.target.value)} />

        <input
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
        />

        <input value={rua} placeholder="Rua" readOnly />
        <input value={cidade} placeholder="Cidade" readOnly />
        <input value={estado} placeholder="Estado" readOnly />

        <input type="file" onChange={(e) => setFotoPerfil(e.target.files[0])} />
        <input type="file" onChange={(e) => setFotoCapa(e.target.files[0])} />

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={editandoId ? handleUpdate : handleCreate}>
            {editandoId ? 'Atualizar' : 'Criar'}
          </button>

          {editandoId && (
            <button onClick={resetForm}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* LISTA */}
      <h3>Igrejas cadastradas</h3>

      {igrejas.map((i) => (
        <div key={i.id} style={card}>
          <div>
            <strong>{i.nome}</strong>
            <p>{i.endereco}</p>
            <p>{i.telefone}</p>
          </div>

          <div style={actions}>
            <button onClick={() => handleEdit(i)}>Editar</button>
            <button onClick={() => handleDelete(i.id)}>Excluir</button>
          </div>
        </div>
      ))}
    </div>
  )
}

const form = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  maxWidth: 400
}

const card = {
  border: '1px solid #ccc',
  padding: 10,
  marginTop: 10,
  display: 'flex',
  justifyContent: 'space-between'
}

const actions = {
  display: 'flex',
  gap: 10
}