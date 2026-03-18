import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div style={container}>

      {/* HERO */}
      <section style={hero}>
        <h1 style={title}>
          Descubra e divulgue eventos da sua igreja
        </h1>

        <p style={subtitle}>
          O ChurchUp conecta pessoas a eventos cristãos na sua cidade.
        </p>

        <Link to="/login">
          <button style={cta}>Começar agora</button>
        </Link>
      </section>

      {/* PROBLEMA */}
      <section style={section}>
        <h2>O problema</h2>
        <p>
          Muitas igrejas realizam eventos incríveis, mas poucas pessoas ficam sabendo.
          A divulgação é limitada e descentralizada.
        </p>
      </section>

      {/* SOLUÇÃO */}
      <section style={section}>
        <h2>A solução</h2>
        <p>
          O ChurchUp centraliza eventos de igrejas, permitindo que qualquer pessoa
          encontre programações próximas com facilidade.
        </p>
      </section>

      {/* COMO FUNCIONA */}
      <section style={section}>
        <h2>Como funciona</h2>

        <div style={grid}>
          <div style={card}>
            <h3>Cadastre sua igreja</h3>
            <p>Crie o perfil da sua igreja em minutos</p>
          </div>

          <div style={card}>
            <h3>Publique eventos</h3>
            <p>Divulgue cultos, congressos e encontros</p>
          </div>

          <div style={card}>
            <h3>Alcance pessoas</h3>
            <p>Seja encontrado por quem procura eventos</p>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section style={section}>
        <h2>Por que usar?</h2>

        <ul style={list}>
          <li>✔ Mais visibilidade para sua igreja</li>
          <li>✔ Divulgação centralizada</li>
          <li>✔ Aumento de participação nos eventos</li>
        </ul>
      </section>

      {/* CTA FINAL */}
      <section style={ctaSection}>
        <h2>Comece agora</h2>

        <Link to="/login">
          <button style={cta}>Criar conta grátis</button>
        </Link>
      </section>

    </div>
  )
}

//
// 🎨 ESTILO
//

const container = {
  background: '#020617',
  color: '#fff',
  minHeight: '100vh'
}

const hero = {
  textAlign: 'center',
  padding: '80px 20px'
}

const title = {
  fontSize: 36,
  fontWeight: 'bold'
}

const subtitle = {
  marginTop: 10,
  color: '#94a3b8'
}

const section = {
  padding: '60px 20px',
  maxWidth: 900,
  margin: '0 auto'
}

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: 20,
  marginTop: 20
}

const card = {
  background: '#0f172a',
  padding: 20,
  borderRadius: 10
}

const list = {
  marginTop: 20,
  lineHeight: 2
}

const ctaSection = {
  textAlign: 'center',
  padding: '60px 20px'
}

const cta = {
  marginTop: 20,
  background: 'orange',
  border: 'none',
  padding: '12px 20px',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 'bold'
}