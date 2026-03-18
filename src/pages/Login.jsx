import { useState } from 'react'
import { supabase } from '../services/supabaseClient'

export default function Login() {
  const [isRegister, setIsRegister] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [nome, setNome] = useState('')
  const [sobrenome, setSobrenome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [lider, setLider] = useState(false)
  const [igrejaNome, setIgrejaNome] = useState('')
  const [cpf, setCpf] = useState('')

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) alert(error.message)
  }

  async function handleRegister() {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      alert(error.message)
      return
    }

    // 🔥 salvar dados extras
    const user = data.user

    await supabase.from('usuarios').insert([
      {
        user_id: user.id,
        nome,
        sobrenome,
        telefone,
        lider,
        igreja_nome: igrejaNome,
        cpf
      }
    ])

    alert('Conta criada com sucesso!')
    setIsRegister(false)
  }

  return (
    <div style={container}>

      <div style={box}>
        <h2>{isRegister ? 'Criar Conta' : 'Entrar'}</h2>

        {/* EMAIL */}
        <input
          style={input}
          type="email"
          placeholder="E-mail"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* SENHA */}
        <input
          style={input}
          type="password"
          placeholder="Senha"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* CAMPOS DE CADASTRO */}
        {isRegister && (
          <>
            <input style={input} placeholder="Nome" onChange={(e) => setNome(e.target.value)} />
            <input style={input} placeholder="Sobrenome" onChange={(e) => setSobrenome(e.target.value)} />

            <input style={input} placeholder="Telefone" onChange={(e) => setTelefone(e.target.value)} />

            <input style={input} placeholder="CPF" onChange={(e) => setCpf(e.target.value)} />

            <input style={input} placeholder="Nome da Igreja" onChange={(e) => setIgrejaNome(e.target.value)} />

            <label style={checkbox}>
              <input type="checkbox" onChange={(e) => setLider(e.target.checked)} />
              Sou líder de ministério
            </label>
          </>
        )}

        {/* BOTÕES */}
        <button
          style={btn}
          onClick={isRegister ? handleRegister : handleLogin}
        >
          {isRegister ? 'Criar Conta' : 'Entrar'}
        </button>

        <p
          style={switchText}
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister
            ? 'Já tem conta? Entrar'
            : 'Criar uma nova conta'}
        </p>

      </div>

    </div>
  )
}

//
// 🎨 ESTILO PROFISSIONAL
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
  width: 350,
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

const switchText = {
  marginTop: 10,
  fontSize: 14,
  color: '#94a3b8',
  cursor: 'pointer',
  textAlign: 'center'
}

const checkbox = {
  display: 'flex',
  gap: 8,
  alignItems: 'center',
  fontSize: 14
}