import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, it, vi } from 'vitest'
import App from './App'
import data from '../public/data.json'

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => data }))
})

it('carga el archivo local y muestra todos los campos', async () => {
  render(<App />)
  expect(await screen.findByText('Ana García')).toBeInTheDocument()
  expect(screen.getByText('ana.garcia@example.com')).toBeInTheDocument()
  expect(screen.getByText('+52 55 1234 5678')).toBeInTheDocument()
  expect(screen.getByText('Sin teléfono')).toBeInTheDocument()
  expect(screen.getAllByRole('listitem')).toHaveLength(8)
  expect(fetch).toHaveBeenCalledWith('/data.json', expect.objectContaining({ signal: expect.any(AbortSignal) }))
})

it('muestra skeleton mientras la petición está pendiente', () => {
  vi.mocked(fetch).mockReturnValue(new Promise(() => {}))
  render(<App />)
  expect(screen.getByRole('status', { name: 'Cargando contactos' })).toBeInTheDocument()
})

it('muestra un estado vacío cuando no existen contactos', async () => {
  vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => [] } as unknown as Response)
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
  expect(screen.getByRole('button', { name: 'Guardar contacto' })).toBeDisabled()
  await user.type(screen.getByLabelText('Email *'), 'incorrecto')
  expect(await screen.findByText('Escribe un email válido.')).toBeInTheDocument()
  await user.click(screen.getByLabelText('Nombre *'))
  await user.tab()
  expect(await screen.findByText('Escribe el nombre del contacto.')).toBeInTheDocument()
})

it('crea un contacto con UUID, actualiza el contador y limpia el formulario', async () => {
  const user = userEvent.setup()
  const uuid = vi.spyOn(crypto, 'randomUUID').mockReturnValue('bb875a62-8141-42f2-a3ca-35203fd85b42')
  render(<App />)
  await screen.findByText('Ana García')
  await user.click(screen.getByRole('button', { name: 'Agregar contacto' }))
  await user.type(screen.getByLabelText('Nombre *'), '  Lucía Vega  ')
  await user.type(screen.getByLabelText('Email *'), 'lucia@example.com')
  await user.selectOptions(screen.getByLabelText('Departamento *'), 'Ventas')
  await waitFor(() => expect(screen.getByRole('button', { name: 'Guardar contacto' })).toBeEnabled())
  await user.click(screen.getByRole('button', { name: 'Guardar contacto' }))
  expect(await screen.findByText('Lucía Vega')).toBeInTheDocument()
  expect(uuid).toHaveBeenCalledOnce()
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(screen.getByRole('status')).toHaveTextContent('9 contactos')
  await user.click(screen.getByRole('button', { name: 'Agregar contacto' }))
  expect(screen.getByLabelText('Nombre *')).toHaveValue('')
})
