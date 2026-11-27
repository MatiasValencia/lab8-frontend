import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import { useState, type MouseEvent } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ListaClientes from './ListaClientes'

afterEach(() => {
  cleanup()
})

function renderListaClientes(initialPath = '/clientes') {
  function Harness() {
    const [path, setPath] = useState(initialPath)
    const navigateTo = (destination: string) => setPath(destination)
    const onNavigate = (
      event: MouseEvent<HTMLAnchorElement>,
      destination: string,
    ) => {
      event.preventDefault()
      navigateTo(destination)
    }

    return (
      <ListaClientes
        path={path}
        onNavigate={onNavigate}
        navigateTo={navigateTo}
      />
    )
  }

  return render(<Harness />)
}

describe('ListaClientes', () => {
  it('consulta la lista vacía y agrega y consulta un cliente válido', async () => {
    const user = userEvent.setup()
    renderListaClientes()

    expect(screen.getByText('Aún no hay clientes')).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: /agregar cliente/i }))
    await user.type(screen.getByLabelText(/nombre del cliente/i), ' Camila Pérez ')
    await user.type(
      screen.getByLabelText(/correo del cliente/i),
      ' camila@example.cl ',
    )
    await user.type(
      screen.getByLabelText(/teléfono del cliente/i),
      ' +56912345678 ',
    )
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(screen.getByRole('heading', { name: 'Camila Pérez' })).toBeInTheDocument()
    expect(screen.getByText('camila@example.cl · +56912345678'))
      .toBeInTheDocument()
  })

  it('rechaza el formulario vacío y uno parcialmente completo', async () => {
    const user = userEvent.setup()
    renderListaClientes('/clientes/nuevo')
    const form = screen.getByRole('button', { name: 'Guardar cambios' })
      .closest('form')

    expect(form).not.toBeNull()
    fireEvent.submit(form!)
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Completa todos los campos obligatorios.',
    )

    await user.type(screen.getByLabelText(/nombre del cliente/i), 'Camila')
    fireEvent.submit(form!)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Agregar cliente' }))
      .toBeInTheDocument()
  })

  it.each([
    ['correo sin arroba', 'usuario.dominio.cl', '+56912345678'],
    ['correo sin sufijo de dominio', 'usuario@dominio', '+56912345678'],
    ['teléfono con prefijo incorrecto', 'usuario@dominio.cl', '+56812345678'],
    ['teléfono con longitud incorrecta', 'usuario@dominio.cl', '+5691234567'],
  ])('rechaza datos inválidos: %s', async (_caseName, email, phone) => {
    const user = userEvent.setup()
    renderListaClientes('/clientes/nuevo')
    await user.type(screen.getByLabelText(/nombre del cliente/i), 'Camila')
    await user.type(screen.getByLabelText(/correo del cliente/i), email)
    await user.type(screen.getByLabelText(/teléfono del cliente/i), phone)
    fireEvent.submit(
      screen.getByRole('button', { name: 'Guardar cambios' }).closest('form')!,
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Agregar cliente' }))
      .toBeInTheDocument()
  })

  it('edita un cliente existente sin duplicarlo', async () => {
    const user = userEvent.setup()
    renderListaClientes()

    await user.click(screen.getByRole('link', { name: /agregar cliente/i }))
    await user.type(screen.getByLabelText(/nombre del cliente/i), 'Camila')
    await user.type(screen.getByLabelText(/correo del cliente/i), 'c@example.cl')
    await user.type(screen.getByLabelText(/teléfono del cliente/i), '+56912345678')
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    await user.click(screen.getByRole('link', { name: 'Editar' }))
    expect(screen.getByLabelText(/nombre del cliente/i)).toHaveValue('Camila')
    await user.clear(screen.getByLabelText(/nombre del cliente/i))
    await user.type(screen.getByLabelText(/nombre del cliente/i), 'Camila Pérez')
    await user.clear(screen.getByLabelText(/correo del cliente/i))
    await user.type(
      screen.getByLabelText(/correo del cliente/i),
      'camila@example.cl',
    )
    await user.clear(screen.getByLabelText(/teléfono del cliente/i))
    await user.type(
      screen.getByLabelText(/teléfono del cliente/i),
      '+56987654321',
    )
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(screen.getByRole('heading', { name: 'Camila Pérez' })).toBeInTheDocument()
    expect(screen.queryByText('c@example.cl · +56912345678'))
      .not.toBeInTheDocument()
  })

  it('elimina el cliente solo tras las dos confirmaciones', async () => {
    const user = userEvent.setup()
    renderListaClientes()

    await user.click(screen.getByRole('link', { name: /agregar cliente/i }))
    await user.type(screen.getByLabelText(/nombre del cliente/i), 'Camila')
    await user.type(screen.getByLabelText(/correo del cliente/i), 'c@example.cl')
    await user.type(screen.getByLabelText(/teléfono del cliente/i), '+56912345678')
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    const confirm = vi.spyOn(window, 'confirm')
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
    await user.click(screen.getByRole('button', { name: 'Eliminar' }))
    expect(screen.getByRole('heading', { name: 'Camila' })).toBeInTheDocument()
    expect(confirm).toHaveBeenCalledTimes(2)

    confirm.mockReturnValue(true)
    await user.click(screen.getByRole('button', { name: 'Eliminar' }))
    expect(screen.getByText('Aún no hay clientes')).toBeInTheDocument()
  })
})
