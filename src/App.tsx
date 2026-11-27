import { useEffect, useState, type MouseEvent } from 'react'
import autoImg from './assets/auto.jpg'
import clienteImg from './assets/cliente.jpg'
import './App.css'
import ListaAutos from './ListaAutos'

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  )
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigateTo = (destination: string) => {
    window.history.pushState(null, '', destination)
    setPath(destination)
  }

  const navigate = (event: MouseEvent<HTMLAnchorElement>, destination: string) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    event.preventDefault()
    navigateTo(destination)
  }

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))
  }
  const isAutomobilePage =
    path === '/automoviles' || path.startsWith('/automoviles/')

  return (
    <main className="app-shell" data-theme={theme}>
      <header className="topbar">
        <a
          className="brand"
          href="/"
          aria-label="Inicio de AutoGestión"
          onClick={(event) => navigate(event, '/')}
        >
          <span className="brand-mark" aria-hidden="true">A</span>
          <span>AutoGestión</span>
        </a>

        <button
          className="theme-toggle"
          type="button"
          role="switch"
          aria-checked={theme === 'dark'}
          aria-label={`Activar modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
          onClick={toggleTheme}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
          </svg>
          <span className="toggle-track">
            <span className="toggle-thumb" />
          </span>
          <svg className="moon-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1Z" />
          </svg>
        </button>
      </header>

      {isAutomobilePage ? (
        <ListaAutos
          path={path}
          onNavigate={navigate}
          navigateTo={navigateTo}
        />
      ) : (
        <>
          <section className="welcome">
            <p className="eyebrow">Laboratorio FullStack</p>
            <h1>Todo lo que necesitas,<br />en un solo lugar.</h1>
            <p className="welcome-copy">
              Explora y administra la información de automóviles y clientes.
            </p>
          </section>

          <section className="destination-grid" aria-label="Secciones disponibles">
            <a
              className="destination-card"
              href="/automoviles"
              onClick={(event) => navigate(event, '/automoviles')}
            >
              <img src={autoImg} alt="" className="destination-image" />
              <span className="card-caption">
                <span className="card-title">Lista de automóviles</span>
                <span className="card-arrow" aria-hidden="true">↗</span>
              </span>
            </a>
            <a
              className="destination-card"
              href="/clientes"
              onClick={(event) => navigate(event, '/clientes')}
            >
              <img src={clienteImg} alt="" className="destination-image" />
              <span className="card-caption">
                <span className="card-title">Lista de clientes</span>
                <span className="card-arrow" aria-hidden="true">↗</span>
              </span>
            </a>
          </section>

          <aside className="disclaimer" aria-label="Aviso sobre datos de prueba">
            <span className="disclaimer-icon" aria-hidden="true">i</span>
            <p>
              <strong>Proyecto de prueba:</strong> si agregas información de clientes,
              utiliza únicamente datos ficticios. Esta aplicación es una demostración
              de cómo funciona FullStack.
            </p>
          </aside>
        </>
      )}

      <footer className="footer">
        <span>AutoGestión</span>
        <span>Laboratorio de desarrollo FullStack</span>
      </footer>
    </main>
  )
}

export default App
