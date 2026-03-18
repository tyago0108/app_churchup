import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [perfil, setPerfil] = useState(null)

  const [editando, setEditando] = useState(false)
  const [loading, setLoading] = useState(true)

  const [nome, setNome] = useState('')
  const [sobrenome, setSobrenome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [cpf, setCpf] = useState('')
  const [igrejaNome, setIgrejaNome] = useState('')
  const [lider, setLider] = useState(false)

  useEffect(() => {
    loadUser()
  }, [])

  async function loadUser() {
    setLoading(true)

    const { data: userData } = await supabase.auth.getUser()

    if (!userData?.user) {
      setLoading(false)
      return
    }

    setUser(userData.user)

    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('user_id', userData.user.id)

    if (error) {
      console.log('ERRO LOAD PERFIL:', error)
      setLoading(false)
      return
    }

    if (data && data.length > 0) {
      const p = data[0]

      setPerfil(p)

      setNome(p.nome || '')
      setSobrenome(p.sobrenome || '')
      setTelefone(p.telefone || '')
      setCpf(p.cpf || '')
      setIgrejaNome(p.igreja_nome || '')
      setLider(p.lider || false)
    }

    setLoading(false)
  }

  async function handleUpdate() {
    const { data: userData } = await supabase.auth.getUser()

    if (!userData?.user) return

    const { error } = await supabase
      .from('usuarios')
      .update({
        nome,
        sobrenome,
        telefone,
        cpf,
        igreja_nome: igrejaNome,
        lider
      })
      .eq('user_id', userData.user.id)

    if (error) {
      console.log('ERRO UPDATE:', error)
      alert(error.message)
      return
    }

    alert('Perfil atualizado!')
    setEditando(false)
    loadUser()
  }

  if (loading) {
    return <p style={{ padding: 20 }}>Carregando perfil...</p>
  }

  if (!user) {
    return <p style={{ padding: 20 }}>Usuário não encontrado</p>
  }

  return (
    <div style={container}>
      <div style={box}>
        <h2>Meu Perfil</h2>

        <p style={email}>{user.email}</p>

        {!editando ? (
          <>
            {/* VISUAL */}
            <p><strong>Nome:</strong> {perfil?.nome || '-'} {perfil?.sobrenome || ''}</p>
            <p><strong>Telefone:</strong> {perfil?.telefone || '-'}</p>
            <p><strong>CPF:</strong> {perfil?.cpf || '-'}</p>
            <p><strong>Igreja:</strong> {perfil?.igreja_nome || '-'}</p>
            <p><strong>Líder:</strong> {perfil?.lider ? 'Sim' : 'Não'}</p>

            <button style={btn} onClick={() => setEditando(true)}>
              Editar Perfil
            </button>
          </>
        ) : (
          <>
            {/* FORM */}
            <input style={input} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" />
            <input style={input} value={sobrenome} onChange={(e) => setSobrenome(e.target.value)} placeholder="Sobrenome" />
            <input style={input} value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="Telefone" />
            <input style={input} value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="CPF" />
            <input style={input} value={igrejaNome} onChange={(e) => setIgrejaNome(e.target.value)} placeholder="Nome da Igreja" />

            <label style={checkbox}>
              <input type="checkbox" checked={lider} onChange={(e) => setLider(e.target.checked)} />
              Sou líder de ministério
            </label>

            <div style={{ display: 'flex', gap: 10 }}>
              <button style={btn} onClick={handleUpdate}>
                Salvar
              </button>

              <button style={btnCancel} onClick={() => setEditando(false)}>
                Cancelar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

//
// 🎨 ESTILO
//

const container = {
  background: '#020617',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

const box = {
  background: '#0f172a',
  padding: 30,
  borderRadius: 12,
  width: 420,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  border: '1px solid #1e293b',
  color: '#fff'
}

const input = {
  padding: 10,
  borderRadius: 8,
  border: '1px solid #334155',
  background: '#020617',
  color: '#fff'
}

const btn = {
  marginTop: 10,
  background: 'orange',
  border: 'none',
  padding: 10,
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 'bold'
}

const btnCancel = {
  background: '#334155',
  border: 'none',
  padding: 10,
  borderRadius: 8,
  cursor: 'pointer',
  color: '#fff'
}

const email = {
  fontSize: 14,
  color: '#94a3b8',
  marginBottom: 10
}

const checkbox = {
  display: 'flex',
  gap: 8,
  alignItems: 'center',
  fontSize: 14
}