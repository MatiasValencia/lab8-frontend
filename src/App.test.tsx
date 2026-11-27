import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  window.history.replaceState(null, '', '/')
})

describe('App', () => {
  it('muestra la página de inicio y permite navegar a las listas', async () => {
    const user = userEvent.setup()
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({ matches: false }),
    )
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /todo lo que necesitas/i }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: /lista de automóviles/i }))
    expect(
      screen.getByRole('heading', { name: 'Lista de automóviles' }),
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole('link', { name: 'Inicio de AutoGestión' }),
    )
    await user.click(screen.getByRole('link', { name: /lista de clientes/i }))
    expect(
      screen.getByRole('heading', { name: 'Lista de clientes' }),
    ).toBeInTheDocument()
  })

  it('alterna el tema claro y oscuro', async () => {
    const user = userEvent.setup()
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({ matches: false }),
    )
    render(<App />)

    const themeSwitch = screen.getByRole('switch', { name: 'Activar modo oscuro' })
    expect(themeSwitch).toHaveAttribute('aria-checked', 'false')
    expect(screen.getByRole('main')).toHaveAttribute('data-theme', 'light')

    await user.click(themeSwitch)

    expect(screen.getByRole('switch', { name: 'Activar modo claro' }))
      .toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('main')).toHaveAttribute('data-theme', 'dark')
  })
})
