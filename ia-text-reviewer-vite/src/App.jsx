import React, { useState, useRef, useEffect } from 'react'

function ChatBubble({ who, children }) {
  const isUser = who === 'user'
  return (
    <div className={isUser ? 'bubble user' : 'bubble ia'}>
      <div className="bubble-content">{children}</div>
    </div>
  )
}

export default function App() {
  const [messages, setMessages] = useState([
    { who: 'ia', text: 'Hola — soy tu asistente IA. Pega un texto para revisar o escribe una idea para generar contenido.' }
  ])
  const [input, setInput] = useState('')
  const [mode, setMode] = useState('review') // 'review' or 'generate'
  const [instruction, setInstruction] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(()=> { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  async function sendMessage(e) {
    e?.preventDefault()
    if (!input.trim()) return
    const userText = input.trim()
    setMessages(m => [...m, { who: 'user', text: userText }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, text: userText, instruction })
      })
      const data = await res.json()

      // Try to extract an intelligible reply from common Replicate responses.
      let reply = ''
      if (data.output && Array.isArray(data.output) && data.output.length) {
        reply = data.output.join('\n')
      } else if (data.output && typeof data.output === 'string') {
        reply = data.output
      } else if (data.result && typeof data.result === 'string') {
        reply = data.result
      } else if (data.error) {
        reply = 'Error: ' + String(data.error)
      } else {
        // fallback: stringify the whole response (shortened)
        const s = JSON.stringify(data)
        reply = s.length > 300 ? s.slice(0,300) + '...' : s
      }

      setMessages(m => [...m, { who: 'ia', text: reply }])
    } catch (err) {
      setMessages(m => [...m, { who: 'ia', text: 'Error al conectar con el backend: ' + String(err) }])
    } finally {
      setLoading(false)
    }
  }

  function clearChat() {
    setMessages([{ who: 'ia', text: 'Hola — soy tu asistente IA. Pega un texto para revisar o escribe una idea para generar contenido.' }])
  }

  return (
    <div className="app">
      <div className="panel">
        <header className="header">
          <div className="brand">
            <div className="logo">🤖</div>
            <div>
              <div className="title">IA Text Reviewer</div>
              <div className="subtitle">Revisión y generación de textos — conectado a Replicate</div>
            </div>
          </div>
          <div className="controls">
            <select value={mode} onChange={e=>setMode(e.target.value)} className="select">
              <option value="review">Revisar</option>
              <option value="generate">Generar</option>
            </select>
            {mode === 'generate' && <input className="instr" placeholder="Instrucción (opcional)" value={instruction} onChange={e=>setInstruction(e.target.value)} />}
            <button className="btn ghost" onClick={clearChat}>Limpiar</button>
          </div>
        </header>

        <main className="chat" id="chat">
          {messages.map((m, i) => (
            <ChatBubble key={i} who={m.who}>
              {m.text}
            </ChatBubble>
          ))}
          {loading && <div className="bubble ia"><div className="bubble-content typing">Generando respuesta...</div></div>}
          <div ref={endRef} />
        </main>

        <form className="composer" onSubmit={sendMessage}>
          <textarea placeholder={mode === 'review' ? 'Pega el texto a revisar...' : 'Escribe una idea breve para generar texto...'} value={input} onChange={e=>setInput(e.target.value)} />
          <div className="composer-actions">
            <button type="submit" className="btn">{loading ? 'Procesando...' : (mode === 'review' ? 'Revisar' : 'Generar')}</button>
          </div>
        </form>
      </div>
      <footer className="footer">Diseño oscuro futurista • Preparado para GitHub Pages + Vite</footer>
    </div>
  )
}
