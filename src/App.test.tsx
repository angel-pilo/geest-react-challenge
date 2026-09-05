import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, it, vi } from 'vitest'
import App from './App'
import data from '../public/data.json'

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok: true, json: async () => data }),
  )
})

it('muestra el error requerido al borrar un campo sin perder el foco', async () => {
  const user = userEvent.setup()
  render(<App />)
  await screen.findByText('Ana García')
  await user.click(screen.getByRole('button', { name: 'Agregar contacto' }))
  const name = screen.getByLabelText('Nombre *')
  await user.type(name, 'Ana')
  await user.clear(name)
  expect(name).toHaveFocus()
  expect(
    await screen.findByText('Escribe el nombre del contacto.'),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('button', { name: 'Guardar contacto' }),
  ).toBeDisabled()
})

it('carga el archivo local y muestra todos los campos', async () => {
  render(<App />)
  expect(await screen.findByText('Ana García')).toBeInTheDocument()
  expect(screen.getByText('ana.garcia@example.com')).toBeInTheDocument()
  expect(screen.getByText('+52 55 1234 5678')).toBeInTheDocument()
  expect(screen.getByText('Sin teléfono')).toBeInTheDocument()
  expect(screen.getAllByRole('listitem')).toHaveLength(8)
  expect(fetch).toHaveBeenCalledWith(
    '/data.json',
    expect.objectContaining({ signal: expect.any(AbortSignal) }),
  )
})

it('muestra skeleton mientras la petición está pendiente', () => {
  vi.mocked(fetch).mockReturnValue(new Promise(() => {}))
  render(<App />)
  expect(
    screen.getByRole('status', { name: 'Cargando contactos' }),
  ).toBeInTheDocument()
})

it('muestra un estado vacío cuando no existen contactos', async () => {
  vi.mocked(fetch).mockResolvedValue({
    ok: true,
    json: async () => [],
  } as unknown as Response)
  render(<App />)
  expect(await screen.findByText('Aún no hay contactos')).toBeInTheDocument()
})

it('informa cuando falla la carga', async () => {
  vi.mocked(fetch).mockRejectedValue(new Error('Error de red'))
  render(<App />)
  expect(await screen.findByRole('alert')).toHaveTextContent('Error de red')
})

it('valida desde el inicio y muestra errores mientras se escribe', async () => {
  const user = userEvent.setup()
  render(<App />)
  await screen.findByText('Ana García')
  await user.click(screen.getByRole('button', { name: 'Agregar contacto' }))
  expect(
    screen.getByRole('button', { name: 'Guardar contacto' }),
  ).toBeDisabled()
  await user.type(screen.getByLabelText('Email *'), 'incorrecto')
  expect(
    await screen.findByText('Escribe un email válido.'),
  ).toBeInTheDocument()
  await user.click(screen.getByLabelText('Nombre *'))
  await user.tab()
  expect(
    await screen.findByText('Escribe el nombre del contacto.'),
  ).toBeInTheDocument()
})

it('rechaza números en el nombre, dominios incompletos y letras en el teléfono', async () => {
  const user = userEvent.setup()
  render(<App />)
  await screen.findByText('Ana García')
  await user.click(screen.getByRole('button', { name: 'Agregar contacto' }))
  await user.type(screen.getByLabelText('Nombre *'), 'Ana 123')
  await user.type(screen.getByLabelText('Email *'), 'a@a')
  await user.type(screen.getByLabelText(/Teléfono/), '55 ABC 1234')
  await user.selectOptions(screen.getByLabelText('Departamento *'), 'Ventas')

  expect(
    await screen.findByText(
      'Usa únicamente letras, espacios, apóstrofes o guiones.',
    ),
  ).toBeInTheDocument()
  expect(screen.getByText('Escribe un email válido.')).toBeInTheDocument()
  expect(
    screen.getByText(
      'Usa únicamente números y los símbolos +, espacios, paréntesis o guiones.',
    ),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('button', { name: 'Guardar contacto' }),
  ).toBeDisabled()
})

it('crea un contacto con UUID, actualiza el contador y limpia el formulario', async () => {
  const user = userEvent.setup()
  const uuid = vi
    .spyOn(crypto, 'randomUUID')
    .mockReturnValue('bb875a62-8141-42f2-a3ca-35203fd85b42')
  render(<App />)
  await screen.findByText('Ana García')
  await user.click(screen.getByRole('button', { name: 'Agregar contacto' }))
  await user.type(screen.getByLabelText('Nombre *'), '  Lucía Vega  ')
  await user.type(screen.getByLabelText('Email *'), 'lucia@example.com')
  await user.selectOptions(screen.getByLabelText('Departamento *'), 'Ventas')
  await waitFor(() =>
    expect(
      screen.getByRole('button', { name: 'Guardar contacto' }),
    ).toBeEnabled(),
  )
  await user.click(screen.getByRole('button', { name: 'Guardar contacto' }))
  expect(await screen.findByText('Lucía Vega')).toBeInTheDocument()
  expect(uuid).toHaveBeenCalledOnce()
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(screen.getByRole('status')).toHaveTextContent('9 contactos')
  await user.click(screen.getByRole('button', { name: 'Agregar contacto' }))
  expect(screen.getByLabelText('Nombre *')).toHaveValue('')
})

it('busca por nombre ignorando mayúsculas y actualiza el contador', async () => {
  const user = userEvent.setup()
  render(<App />)
  await screen.findByText('Ana García')
  await user.type(screen.getByRole('searchbox'), 'cARLos')
  expect(screen.getByText('Carlos Mendoza')).toBeInTheDocument()
  expect(screen.queryByText('Ana García')).not.toBeInTheDocument()
  expect(screen.getByRole('status')).toHaveTextContent('1 contacto de 8')
})

it('busca por nombre ignorando acentos', async () => {
  const user = userEvent.setup()
  render(<App />)
  await screen.findByText('Ana García')
  await user.type(screen.getByRole('searchbox'), 'sofia')
  expect(screen.getByText('Sofía Ramírez')).toBeInTheDocument()
  expect(screen.getByRole('status')).toHaveTextContent('1 contacto de 8')
})

it('combina departamento y nombre y permite limpiar filtros sin resultados', async () => {
  const user = userEvent.setup()
  render(<App />)
  await screen.findByText('Ana García')
  await user.click(screen.getByRole('button', { name: 'Desarrollo' }))
  expect(screen.getAllByRole('listitem')).toHaveLength(2)
  await user.type(screen.getByRole('searchbox'), 'Carlos')
  expect(screen.getAllByRole('listitem')).toHaveLength(1)
  await user.click(screen.getByRole('button', { name: 'Ventas' }))
  expect(screen.getByText('No encontramos resultados')).toBeInTheDocument()
  expect(screen.getByRole('status')).toHaveTextContent('0 contactos de 8')
  await user.click(screen.getByRole('button', { name: 'Limpiar filtros' }))
  expect(screen.getByRole('searchbox')).toHaveValue('')
  expect(screen.getByRole('button', { name: 'Todos' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  expect(screen.getAllByRole('listitem')).toHaveLength(8)
})

it('elimina por id y actualiza la lista y el contador', async () => {
  const user = userEvent.setup()
  render(<App />)
  await screen.findByText('Ana García')
  await user.click(
    screen.getByRole('button', { name: 'Eliminar a Ana García' }),
  )
  expect(screen.queryByText('Ana García')).not.toBeInTheDocument()
  expect(screen.getAllByRole('listitem')).toHaveLength(7)
  expect(screen.getByRole('status')).toHaveTextContent('7 contactos de 7')
})

it('ofrece reintentar la carga y recupera el directorio', async () => {
  const user = userEvent.setup()
  vi.mocked(fetch).mockRejectedValueOnce(new Error('Sin conexión'))
  render(<App />)
  await user.click(await screen.findByRole('button', { name: 'Reintentar' }))
  expect(await screen.findByText('Ana García')).toBeInTheDocument()
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})

it.each([
  { ok: false, json: async () => data },
  { ok: true, json: async () => ({ contacts: data }) },
  { ok: true, json: async () => [data[0], data[0]] },
])('rechaza respuestas HTTP y datos inválidos (%#)', async (response) => {
  vi.mocked(fetch).mockResolvedValue(response as Response)
  render(<App />)
  expect(await screen.findByRole('alert')).toBeInTheDocument()
  expect(screen.queryByRole('list')).not.toBeInTheDocument()
  expect(
    screen.getByRole('button', { name: 'Agregar contacto' }),
  ).toBeDisabled()
})

it('muestra el estado sin contactos tras eliminar el último', async () => {
  const user = userEvent.setup()
  vi.mocked(fetch).mockResolvedValue({
    ok: true,
    json: async () => [data[0]],
  } as Response)
  render(<App />)
  await user.click(
    await screen.findByRole('button', { name: 'Eliminar a Ana García' }),
  )
  expect(screen.getByText('Aún no hay contactos')).toBeInTheDocument()
  expect(
    screen.queryByText('No encontramos resultados'),
  ).not.toBeInTheDocument()
  expect(screen.getByRole('status')).toHaveTextContent('0 contactos de 0')
})

it.each(['Cerrar modal', 'Cancelar'])(
  'cierra mediante %s sin guardar y devuelve el foco',
  async (action) => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Ana García')
    const trigger = screen.getByRole('button', { name: 'Agregar contacto' })
    await user.click(trigger)
    await user.type(screen.getByLabelText('Nombre *'), 'Borrador')
    await user.click(screen.getByRole('button', { name: action }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
    expect(screen.getAllByRole('listitem')).toHaveLength(8)
  },
)

it('responde al evento cancel nativo de Escape y al clic fuera', async () => {
  const user = userEvent.setup()
  render(<App />)
  await screen.findByText('Ana García')
  await user.click(screen.getByRole('button', { name: 'Agregar contacto' }))
  fireEvent(
    screen.getByRole('dialog'),
    new Event('cancel', { bubbles: false, cancelable: true }),
  )
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Agregar contacto' }))
  await user.click(screen.getByRole('heading', { name: 'Agregar contacto' }))
  expect(screen.getByRole('dialog')).toBeInTheDocument()
  await user.click(screen.getByRole('dialog'))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

it('mantiene guardar deshabilitado con nombre vacío o departamento ausente', async () => {
  const user = userEvent.setup()
  render(<App />)
  await screen.findByText('Ana García')
  await user.click(screen.getByRole('button', { name: 'Agregar contacto' }))
  await user.type(screen.getByLabelText('Nombre *'), '   ')
  await user.type(screen.getByLabelText('Email *'), 'valido@example.com')
  await user.selectOptions(screen.getByLabelText('Departamento *'), 'Ventas')
  expect(
    await screen.findByText('Escribe el nombre del contacto.'),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('button', { name: 'Guardar contacto' }),
  ).toBeDisabled()
  await user.type(screen.getByLabelText('Nombre *'), 'Contacto')
  await user.selectOptions(screen.getByLabelText('Departamento *'), '')
  expect(
    screen.getByRole('button', { name: 'Guardar contacto' }),
  ).toBeDisabled()
})

it('restaura data.json al montar una nueva sesión', async () => {
  const user = userEvent.setup()
  const first = render(<App />)
  await user.click(
    await screen.findByRole('button', { name: 'Eliminar a Ana García' }),
  )
  first.unmount()
  render(<App />)
  expect(await screen.findByText('Ana García')).toBeInTheDocument()
  expect(screen.getAllByRole('listitem')).toHaveLength(8)
})
