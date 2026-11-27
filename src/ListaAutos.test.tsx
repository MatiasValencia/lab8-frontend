import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import { useState, type MouseEvent } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ListaAutos from './ListaAutos'

afterEach(() => {
  cleanup()
})

function renderListaAutos(initialPath = '/automoviles') {
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
      <ListaAutos
        path={path}
        onNavigate={onNavigate}
        navigateTo={navigateTo}
      />
    )
  }

  return render(<Harness />)
}

describe('ListaAutos', () => {
  it('consulta la lista vacía y agrega y consulta un automóvil válido', async () => {
    const user = userEvent.setup()
    renderListaAutos()

    expect(screen.getByText('Aún no hay automóviles')).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: /agregar automóvil/i }))
    await user.type(screen.getByLabelText(/marca del auto/i), ' Toyota ')
    await user.type(screen.getByLabelText(/modelo del auto/i), ' Corolla ')
    await user.clear(screen.getByLabelText(/año del auto/i))
    await user.type(screen.getByLabelText(/año del auto/i), '2024')
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(screen.getByRole('heading', { name: 'Toyota Corolla' }))
      .toBeInTheDocument()
    expect(screen.getByText('Año 2024')).toBeInTheDocument()
  })

  it('rechaza el formulario vacío y uno parcialmente completo', async () => {
    const user = userEvent.setup()
    renderListaAutos('/automoviles/nuevo')
    const form = screen.getByRole('button', { name: 'Guardar cambios' })
      .closest('form')

    expect(form).not.toBeNull()
    fireEvent.submit(form!)
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Completa todos los campos con valores válidos.',
    )

    await user.type(screen.getByLabelText(/marca del auto/i), 'Honda')
    fireEvent.submit(form!)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Agregar automóvil' }))
      .toBeInTheDocument()
  })

  it('rechaza un año decimal y acepta el límite entero inferior ingresado', async () => {
    const user = userEvent.setup()
    renderListaAutos('/automoviles/nuevo')
    await user.type(screen.getByLabelText(/marca del auto/i), 'Ford')
    await user.type(screen.getByLabelText(/modelo del auto/i), 'T')
    fireEvent.change(screen.getByLabelText(/año del auto/i), {
      target: { value: '1886.5' },
    })
    fireEvent.submit(
      screen.getByRole('button', { name: 'Guardar cambios' }).closest('form')!,
    )

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Completa todos los campos con valores válidos.',
    )

    fireEvent.change(screen.getByLabelText(/año del auto/i), {
      target: { value: '1886' },
    })
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(screen.getByRole('heading', { name: 'Ford T' })).toBeInTheDocument()
    expect(screen.getByText('Año 1886')).toBeInTheDocument()
  })

  it('edita un automóvil existente sin duplicarlo', async () => {
    const user = userEvent.setup()
    renderListaAutos()

    await user.click(screen.getByRole('link', { name: /agregar automóvil/i }))
    await user.type(screen.getByLabelText(/marca del auto/i), 'Toyota')
    await user.type(screen.getByLabelText(/modelo del auto/i), 'Corolla')
    await user.clear(screen.getByLabelText(/año del auto/i))
    await user.type(screen.getByLabelText(/año del auto/i), '2020')
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    await user.click(screen.getByRole('link', { name: 'Editar' }))
    expect(screen.getByLabelText(/marca del auto/i)).toHaveValue('Toyota')
    await user.clear(screen.getByLabelText(/marca del auto/i))
    await user.type(screen.getByLabelText(/marca del auto/i), 'Honda')
    await user.clear(screen.getByLabelText(/modelo del auto/i))
    await user.type(screen.getByLabelText(/modelo del auto/i), 'Civic')
    await user.clear(screen.getByLabelText(/año del auto/i))
    await user.type(screen.getByLabelText(/año del auto/i), '2025')
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(screen.getByRole('heading', { name: 'Honda Civic' })).toBeInTheDocument()
    expect(screen.queryByText('Toyota Corolla')).not.toBeInTheDocument()
  })

  it('elimina el automóvil solo tras las dos confirmaciones', async () => {
    const user = userEvent.setup()
    renderListaAutos()

    await user.click(screen.getByRole('link', { name: /agregar automóvil/i }))
    await user.type(screen.getByLabelText(/marca del auto/i), 'Mazda')
    await user.type(screen.getByLabelText(/modelo del auto/i), '3')
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    const confirm = vi.spyOn(window, 'confirm')
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
    await user.click(screen.getByRole('button', { name: 'Eliminar' }))
    expect(screen.getByRole('heading', { name: 'Mazda 3' })).toBeInTheDocument()
    expect(confirm).toHaveBeenCalledTimes(2)

    confirm.mockReturnValue(true)
    await user.click(screen.getByRole('button', { name: 'Eliminar' }))
    expect(screen.getByText('Aún no hay automóviles')).toBeInTheDocument()
  })
})
