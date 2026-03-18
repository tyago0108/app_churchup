import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { Link } from 'react-router-dom'

export default function Admin() {
  const [aba, setAba] = useState('eventos')
  const [eventos, setEventos] = useState([])
  const [igrejas, setIgrejas] = useState([])
  const [usuarios, setUsuarios] = useState([])

  useEffect(() => {
    init()
  }, [])

  async function init() {
    const { data: userData } = await supabase.auth.getUser()

    const { data } = await supabase
      .from('usuarios')
      .select('role')
      .eq('user_id', userData.user.id)
      .maybeSingle()

    if (data?.role !== 'admin') {
      alert('Acesso negado')
      window.location.href = '/'
      return
    }

    loadEventos()
    loadIgrejas()
    loadUsuarios()
  }

  async function loadEventos() {
    const { data } = await supabase
      .from('eventos')
      .select('*')
      .order('created_at', { ascending: false })

    setEventos(data || [])
  }

  async function loadIgrejas() {
    const { data } = await supabase
      .from('igrejas')
      .select('*')
      .order('created_at', { ascending: false })

    setIgrejas(data || [])
  }

  async function loadUsuarios() {
    const { data } = await supabase
      .from('usuarios')
      .select('*')

    setUsuarios(data || [])
  }

  async function aprovarEvento(id) {
    await supabase.from('eventos').update({ aprovado: true }).eq('id', id)
    loadEventos()
  }

  async function aprovarIgreja(id) {
    await supabase.from('igrejas').update({ aprovado: true }).eq('id', id)
    loadIgrejas()
  }

  async function excluirEvento(id) {
    if (!confirm('Excluir evento?')) return
    await supabase.from('eventos').delete().eq('id', id)
    loadEventos()
  }

  async function excluirIgreja(id) {
    if (!confirm('Excluir igreja?')) return
    await supabase.from('igrejas').delete().eq('id', id)
    loadIgrejas()
  }

  async function tornarAdmin(user_id) {
    await supabase
      .from('usuarios')
      .update({ role: 'admin' })
      .eq('user_id', user_id)

    loadUsuarios()
  }

  return (
    <div style={container}>
      <h2>Painel Admin</h2>

      {/* MENU */}
      <div style={tabs}>
        <button onClick={() => setAba('eventos')}>Eventos</button>
        <button onClick={() => setAba('igrejas')}>Igrejas</button>
        <button onClick={() => setAba('usuarios')}>Usuários</button>
      </div>

      {/* EVENTOS */}
      {aba === 'eventos' && (
        <table style={table}>
          <thead>
            <tr>
              <th>Título</th>
              <th>Data</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {eventos.map(e => (
              <tr key={e.id}>
                <td>
                  <Link to={`/evento/${e.id}`} style={link}>
                    {e.titulo}
                  </Link>
                </td>

                <td>{new Date(e.data).toLocaleString()}</td>

                <td>
                  {e.aprovado ? '✅ Aprovado' : '⏳ Pendente'}
                </td>

                <td>
                  {!e.aprovado && (
                    <button onClick={() => aprovarEvento(e.id)}>
                      Aprovar
                    </button>
                  )}

                  <button onClick={() => excluirEvento(e.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* IGREJAS */}
      {aba === 'igrejas' && (
        <table style={table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Cidade</th>
              <th>Estado</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {igrejas.map(i => (
              <tr key={i.id}>
                <td>
                  <Link to={`/igreja/${i.id}`} style={link}>
                    {i.nome}
                  </Link>
                </td>

                <td>{i.cidade}</td>
                <td>{i.estado}</td>

                <td>
                  {i.aprovado ? '✅ Aprovada' : '⏳ Pendente'}
                </td>

                <td>
                  {!i.aprovado && (
                    <button onClick={() => aprovarIgreja(i.id)}>
                      Aprovar
                    </button>
                  )}

                  <button onClick={() => excluirIgreja(i.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* USUÁRIOS */}
      {aba === 'usuarios' && (
        <table style={table}>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Role</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map(u => (
              <tr key={u.id}>
                <td>{u.user_id}</td>
                <td>{u.role || 'user'}</td>

                <td>
                  {u.role !== 'admin' && (
                    <button onClick={() => tornarAdmin(u.user_id)}>
                      Tornar Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
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

const tabs = {
  display: 'flex',
  gap: 10,
  marginBottom: 20
}

const table = {
  width: '100%',
  borderCollapse: 'collapse',
  background: '#020617'
}

const link = {
  color: 'orange',
  textDecoration: 'none',
  fontWeight: 'bold'
}