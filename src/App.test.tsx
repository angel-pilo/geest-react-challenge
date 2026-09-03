import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import App from './App'

it('muestra el directorio de contactos', () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: 'Contactos' })).toBeInTheDocument()
})
