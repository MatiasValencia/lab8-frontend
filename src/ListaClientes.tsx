import { useState, type FormEvent, type MouseEvent } from 'react'
import './lista.css'

type Client = {
  id: number
  name: string
  email: string
  phone: string
}

type ListaClientesProps = {
  path: string
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, destination: string) => void
  navigateTo: (destination: string) => void
}

function ListaClientes({ path, onNavigate, navigateTo }: ListaClientesProps) {
  const [clients, setClients] = useState<Client[]>([])
  const isNewClient = path === '/clientes/nuevo'
  const editMatch = path.match(/^\/clientes\/(\d+)\/editar$/)
  const editingClient = editMatch
    ? clients.find((client) => client.id === Number(editMatch[1]))
    : undefined

  const saveClient = (name: string, email: string, phone: string) => {
    if (editingClient) {
      setClients((currentClients) =>
        currentClients.map((client) =>
          client.id === editingClient.id
            ? { ...client, name, email, phone }
            : client,
        ),
      )
    } else {
      setClients((currentClients) => [
        ...currentClients,
        { id: Date.now(), name, email, phone },
      ])
    }
    navigateTo('/clientes')
  }

  const deleteClient = (client: Client) => {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar al cliente ${client.name}?`,
    )
    if (!confirmed) return

    const confirmedAgain = window.confirm(
      'Esta acción no se puede deshacer. ¿Confirmas que quieres eliminarlo?',
    )
    if (!confirmedAgain) return

    setClients((currentClients) =>
      currentClients.filter((item) => item.id !== client.id),
    )
  }

  if (isNewClient || editingClient) {
    return (
      <ClientForm
        initialClient={editingClient}
        onSave={saveClient}
        onCancel={onNavigate}
        onNavigate={onNavigate}
      />
    )
  }

  return (
    <section className="car-page">
      <div className="car-page-heading">
        <div>
          <p className="eyebrow">Clientes</p>
          <h1>Lista de clientes</h1>
          <p className="car-page-copy">Consulta y administra los clientes registrados.</p>
        </div>
        <a
          className="primary-button"
          href="/clientes/nuevo"
          onClick={(event) => onNavigate(event, '/clientes/nuevo')}
        >
          <span aria-hidden="true">+</span> Agregar cliente
        </a>
      </div>

      {clients.length ? (
        <div className="car-list" aria-label="Clientes registrados">
          {clients.map((client) => (
            <article className="car-row" key={client.id}>
              <div className="car-avatar" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.1 0-7 2.1-7 5v1h14v-1c0-2.9-2.9-5-7-5Z" />
                </svg>
              </div>
              <div className="car-details">
                <h2>{client.name}</h2>
                <p>{client.email} · {client.phone}</p>
              </div>
              <div className="car-actions">
                <a
                  className="secondary-button"
                  href={`/clientes/${client.id}/editar`}
                  onClick={(event) =>
                    onNavigate(event, `/clientes/${client.id}/editar`)
                  }
                >
                  Editar
                </a>
                <button
                  className="danger-button"
                  type="button"
                  onClick={() => deleteClient(client)}
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-car-icon" aria-hidden="true">@</span>
          <h2>Aún no hay clientes</h2>
          <p>Agrega el primero para que aparezca en esta lista.</p>
        </div>
      )}

      <DataDisclaimer />
      <ApiDisclaimer />
    </section>
  )
}

type ClientFormProps = {
  initialClient?: Client
  onSave: (name: string, email: string, phone: string) => void
  onCancel: (event: MouseEvent<HTMLAnchorElement>, destination: string) => void
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, destination: string) => void
}

function ClientForm({
  initialClient,
  onSave,
  onCancel,
  onNavigate,
}: ClientFormProps) {
  const [name, setName] = useState(initialClient?.name ?? '')
  const [email, setEmail] = useState(initialClient?.email ?? '')
  const [phone, setPhone] = useState(initialClient?.phone ?? '')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedPhone = phone.trim()

    if (!trimmedName || !trimmedEmail || !trimmedPhone) {
      setError('Completa todos los campos obligatorios.')
      return
    }
    if (!/^[^\s@]+@[^.\s@]+(?:\.[^.\s@]+)+$/.test(trimmedEmail)) {
      setError('Ingresa un correo válido, por ejemplo usuario@dominio.cl.')
      return
    }
    if (!/^\+569\d{8}$/.test(trimmedPhone)) {
      setError('El teléfono debe comenzar con +569 y continuar con ocho dígitos.')
      return
    }

    setError('')
    onSave(trimmedName, trimmedEmail, trimmedPhone)
  }

  return (
    <section className="car-page car-form-page">
      <div className="car-page-heading">
        <div>
          <a
            className="back-link"
            href="/clientes"
            onClick={(event) => onNavigate(event, '/clientes')}
          >
            <span aria-hidden="true">←</span> Lista de clientes
          </a>
          <p className="eyebrow form-eyebrow">
            {initialClient ? 'Editar cliente' : 'Nuevo registro'}
          </p>
          <h1>{initialClient ? 'Editar cliente' : 'Agregar cliente'}</h1>
          <p className="car-page-copy">Ingresa los datos del cliente.</p>
        </div>
      </div>

      <form className="car-form" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Nombre del cliente <span className="required-mark" aria-hidden="true">*</span></span>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ej. Camila Pérez"
            autoComplete="name"
            required
          />
        </label>

        <label className="form-field">
          <span>Correo del cliente <span className="required-mark" aria-hidden="true">*</span></span>
          <input
            type="text"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="usuario@dominio.cl"
            autoComplete="email"
            inputMode="email"
            required
          />
        </label>

        <label className="form-field">
          <span>Teléfono del cliente <span className="required-mark" aria-hidden="true">*</span></span>
          <input
            type="text"
            name="phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+56912345678"
            autoComplete="tel"
            inputMode="tel"
            required
          />
        </label>

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="form-actions">
          <a
            className="secondary-button"
            href="/clientes"
            onClick={(event) => onCancel(event, '/clientes')}
          >
            Descartar cambios
          </a>
          <button className="primary-button" type="submit">
            Guardar cambios
          </button>
        </div>
      </form>

      <DataDisclaimer />
      <ApiDisclaimer />
    </section>
  )
}

function DataDisclaimer() {
  return (
    <aside className="disclaimer api-disclaimer" aria-label="Aviso sobre datos de prueba">
      <span className="disclaimer-icon" aria-hidden="true">i</span>
      <p>
        <strong>Datos ficticios:</strong> utiliza únicamente datos de clientes
        ficticios en esta demostración.
      </p>
    </aside>
  )
}

function ApiDisclaimer() {
  return (
    <aside className="disclaimer api-disclaimer" aria-label="Aviso sobre la API">
      <span className="disclaimer-icon" aria-hidden="true">i</span>
      <p>
        <strong>Conexión pendiente:</strong> las funciones CRUD aún no están
        conectadas al backend (API); por ahora, los cambios se mantienen solo
        temporalmente en esta página.
      </p>
    </aside>
  )
}

export default ListaClientes
