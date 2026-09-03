import { render, screen } from '@testing-library/react'
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
