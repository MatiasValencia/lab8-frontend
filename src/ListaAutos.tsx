import { useState, type FormEvent, type MouseEvent } from 'react'
import './lista.css'

type Car = {
  id: number
  brand: string
  model: string
  year: number
}

type ListaAutosProps = {
  path: string
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, destination: string) => void
  navigateTo: (destination: string) => void
}

function ListaAutos({ path, onNavigate, navigateTo }: ListaAutosProps) {
  const [cars, setCars] = useState<Car[]>([])
  const isNewCar = path === '/automoviles/nuevo'
  const editMatch = path.match(/^\/automoviles\/(\d+)\/editar$/)
  const editingCar = editMatch
    ? cars.find((car) => car.id === Number(editMatch[1]))
    : undefined

  const saveCar = (brand: string, model: string, year: number) => {
    if (editingCar) {
      setCars((currentCars) =>
        currentCars.map((car) =>
          car.id === editingCar.id ? { ...car, brand, model, year } : car,
        ),
      )
    } else {
      setCars((currentCars) => [
        ...currentCars,
        { id: Date.now(), brand, model, year },
      ])
    }
    navigateTo('/automoviles')
  }

  const deleteCar = (car: Car) => {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar el automóvil ${car.brand} ${car.model}?`,
    )
    if (!confirmed) return

    const confirmedAgain = window.confirm(
      'Esta acción no se puede deshacer. ¿Confirmas que quieres eliminarlo?',
    )
    if (!confirmedAgain) return

    setCars((currentCars) => currentCars.filter((item) => item.id !== car.id))
  }

  if (isNewCar || editingCar) {
    return (
      <CarForm
        initialCar={editingCar}
        onSave={saveCar}
        onCancel={onNavigate}
        onNavigate={onNavigate}
      />
    )
  }

  return (
    <section className="car-page">
      <div className="car-page-heading">
        <div>
          <p className="eyebrow">Automóviles</p>
          <h1>Lista de automóviles</h1>
          <p className="car-page-copy">Consulta y administra los automóviles registrados.</p>
        </div>
        <a
          className="primary-button"
          href="/automoviles/nuevo"
          onClick={(event) => onNavigate(event, '/automoviles/nuevo')}
        >
          <span aria-hidden="true">+</span> Agregar automóvil
        </a>
      </div>

      {cars.length ? (
        <div className="car-list" aria-label="Automóviles registrados">
          {cars.map((car) => (
            <article className="car-row" key={car.id}>
              <div className="car-avatar" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M5 11 7 6.5A2.5 2.5 0 0 1 9.3 5h5.4A2.5 2.5 0 0 1 17 6.5l2 4.5 1.5 1.2a1.5 1.5 0 0 1 .5 1.1V17h-2v1.5a1.5 1.5 0 0 1-3 0V17H8v1.5a1.5 1.5 0 0 1-3 0V17H3v-3.7a1.5 1.5 0 0 1 .5-1.1L5 11Zm1.2 0h11.6l-1.6-3.8a1 1 0 0 0-.9-.6H8.7a1 1 0 0 0-.9.6L6.2 11ZM6.5 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm11 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
                </svg>
              </div>
              <div className="car-details">
                <h2>{car.brand} {car.model}</h2>
                <p>Año {car.year}</p>
              </div>
              <div className="car-actions">
                <a
                  className="secondary-button"
                  href={`/automoviles/${car.id}/editar`}
                  onClick={(event) => onNavigate(event, `/automoviles/${car.id}/editar`)}
                >
                  Editar
                </a>
                <button
                  className="danger-button"
                  type="button"
                  onClick={() => deleteCar(car)}
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-car-icon" aria-hidden="true">⌁</span>
          <h2>Aún no hay automóviles</h2>
          <p>Agrega el primero para que aparezca en esta lista.</p>
        </div>
      )}

      <ApiDisclaimer />
    </section>
  )
}

type CarFormProps = {
  initialCar?: Car
  onSave: (brand: string, model: string, year: number) => void
  onCancel: (event: MouseEvent<HTMLAnchorElement>, destination: string) => void
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, destination: string) => void
}

function CarForm({ initialCar, onSave, onCancel, onNavigate }: CarFormProps) {
  const [brand, setBrand] = useState(initialCar?.brand ?? '')
  const [model, setModel] = useState(initialCar?.model ?? '')
  const [year, setYear] = useState(String(initialCar?.year ?? new Date().getFullYear()))
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const parsedYear = Number(year)

    if (!brand.trim() || !model.trim() || !Number.isInteger(parsedYear)) {
      setError('Completa todos los campos con valores válidos.')
      return
    }

    setError('')
    onSave(brand.trim(), model.trim(), parsedYear)
  }

  return (
    <section className="car-page car-form-page">
      <div className="car-page-heading">
        <div>
          <a
            className="back-link"
            href="/automoviles"
            onClick={(event) => onNavigate(event, '/automoviles')}
          >
            <span aria-hidden="true">←</span> Lista de automóviles
          </a>
          <p className="eyebrow form-eyebrow">{initialCar ? 'Editar automóvil' : 'Nuevo registro'}</p>
          <h1>{initialCar ? 'Editar automóvil' : 'Agregar automóvil'}</h1>
          <p className="car-page-copy">Ingresa los datos del automóvil.</p>
        </div>
      </div>

      <form className="car-form" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Marca del auto <span className="required-mark" aria-hidden="true">*</span></span>
          <input
            type="text"
            name="brand"
            value={brand}
            onChange={(event) => setBrand(event.target.value)}
            placeholder="Ej. Toyota"
            autoComplete="off"
            required
          />
        </label>

        <label className="form-field">
          <span>Modelo del auto <span className="required-mark" aria-hidden="true">*</span></span>
          <input
            type="text"
            name="model"
            value={model}
            onChange={(event) => setModel(event.target.value)}
            placeholder="Ej. Corolla"
            autoComplete="off"
            required
          />
        </label>

        <label className="form-field">
          <span>Año del auto <span className="required-mark" aria-hidden="true">*</span></span>
          <input
            type="number"
            name="year"
            value={year}
            onChange={(event) => setYear(event.target.value)}
            step="1"
            required
          />
        </label>

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="form-actions">
          <a
            className="secondary-button"
            href="/automoviles"
            onClick={(event) => onCancel(event, '/automoviles')}
          >
            Descartar cambios
          </a>
          <button className="primary-button" type="submit">
            Guardar cambios
          </button>
        </div>
      </form>

      <ApiDisclaimer />
    </section>
  )
}

function ApiDisclaimer() {
  return (
    <aside className="disclaimer api-disclaimer" aria-label="Aviso sobre la API">
      <span className="disclaimer-icon" aria-hidden="true">i</span>
      <p>
        <strong>Conexión pendiente:</strong> las operaciones CRUD todavía no
        están conectadas al backend (API). Los cambios se mantienen solo
        temporalmente en esta página.
      </p>
    </aside>
  )
}

export default ListaAutos
