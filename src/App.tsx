import { useEffect, useMemo, useState } from 'react'
import './App.css'

type Heart = {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  drift: number
  hue: number
}

function createHeart(id: number): Heart {
  return {
    id,
    left: Math.random() * 100,
    size: 12 + Math.random() * 18,
    duration: 6 + Math.random() * 7,
    delay: Math.random() * 6,
    drift: (Math.random() - 0.5) * 120,
    hue: 340 + Math.random() * 30,
  }
}

const LETTER_LINES: { text: string; className: string; delay: number }[] = [
  { text: 'My Edwina,', className: 'line greeting', delay: 0.3 },
  { text: "It's me, your boyfriend,", className: 'line', delay: 0.9 },
  { text: 'I just wanted to let you know that', className: 'line', delay: 1.4 },
  { text: 'I love you.', className: 'line love', delay: 1.9 },
  {
    text: 'You are the most beautiful girl there ever is and would be,',
    className: 'line',
    delay: 2.3,
  },
  {
    text: 'you are the fittest athlete because you run throught my min constantly.',
    className: 'line',
    delay: 2.7,
  },
  {
    text: "I know I've said it over 1,000,000+ times,",
    className: 'line',
    delay: 3.2,
  },
  {
    text: "but I'll always be enthusiastic about letting you know.",
    className: 'line',
    delay: 3.6,
  },
  { text: 'I cherish you,', className: 'line emphasis', delay: 4.1 },
  { text: 'I adore you,', className: 'line emphasis', delay: 4.5 },
  {
    text: 'and I plan on loving you till our souls depart from our bodies.',
    className: 'line',
    delay: 5.0,
  },
  {
    text: "Even after then, if there's a chance to love you again, I'll find you and I'll love you.",
    className: 'line promise',
    delay: 5.6,
  },
  {
    text: "Can't wait to have you in my possession tomorrow.",
    className: 'line final-line',
    delay: 6.3,
  },
]

function FloatingHearts({ count = 18 }: { count?: number }) {
  const [hearts] = useState<Heart[]>(() =>
    Array.from({ length: count }, (_, i) => createHeart(i)),
  )

  return (
    <div className="hearts" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="heart"
          style={
            {
              left: `${h.left}%`,
              fontSize: `${h.size}px`,
              animationDuration: `${h.duration}s`,
              animationDelay: `${h.delay}s`,
              '--drift': `${h.drift}px`,
              filter: `drop-shadow(0 0 8px hsla(${h.hue}, 90%, 65%, 0.7))`,
            } as React.CSSProperties
          }
        >
          ❤
        </span>
      ))}
    </div>
  )
}

function ParticleCanvas() {
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: 1 + Math.random() * 2.2,
        speed: 0.00015 + Math.random() * 0.0004,
        phase: Math.random() * Math.PI * 2,
        hue: 330 + Math.random() * 40,
      })),
    [],
  )

  useEffect(() => {
    const canvas = document.getElementById('particles') as HTMLCanvasElement | null
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let t = 0
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      t += 1
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(t * p.speed * 60 + p.phase))
        const x = (p.x + Math.sin(t * p.speed + p.phase) * 0.02) * canvas.width
        const y = (p.y + Math.cos(t * p.speed * 0.8 + p.phase) * 0.015) * canvas.height
        ctx.beginPath()
        ctx.arc(x, y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 90%, 70%, ${twinkle * 0.8})`
        ctx.shadowBlur = 12
        ctx.shadowColor = `hsla(${p.hue}, 90%, 65%, 0.9)`
        ctx.fill()
      }
      ctx.shadowBlur = 0
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [particles])

  return <canvas id="particles" aria-hidden="true" />
}

function LetterPage() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <main className={`page ${visible ? 'is-visible' : ''}`}>
      <ParticleCanvas />
      <FloatingHearts />

      <div className="glow glow-one" aria-hidden="true" />
      <div className="glow glow-two" aria-hidden="true" />

      <article className="letter" aria-label="A love letter from Nsikak">
        <div className="letter-ornament top" aria-hidden="true">
          ❦
        </div>

        <div className="lines">
          {LETTER_LINES.map((line) => (
            <p
              key={line.text}
              className={line.className}
              style={{ '--line-delay': `${line.delay}s` } as React.CSSProperties}
            >
              {line.text}
            </p>
          ))}
        </div>

        <p className="signoff">
          Love <span className="signature">Nsikak</span>
          <span className="heart-beat" aria-hidden="true">
            ❤️
          </span>
        </p>

        <div className="letter-ornament bottom" aria-hidden="true">
          ❦
        </div>
      </article>
    </main>
  )
}

type Phase = 'closed' | 'opening' | 'open'

function App() {
  const [phase, setPhase] = useState<Phase>('closed')

  const handleOpen = () => {
    if (phase !== 'closed') return
    setPhase('opening')
    window.setTimeout(() => setPhase('open'), 900)
  }

  if (phase === 'open') return <LetterPage />

  return (
    <main className={`envelope-screen ${phase === 'opening' ? 'is-opening' : ''}`}>
      <button
        type="button"
        className="envelope-btn"
        onClick={handleOpen}
        aria-label="Open your letter"
      >
        <span className="envelope" aria-hidden="true">
          <span className="envelope-flap" />
          <span className="envelope-body" />
          <span className="envelope-heart">❤️</span>
        </span>
        <span className="click-here">Click here</span>
      </button>
    </main>
  )
}

export default App
