import { act, renderHook, waitFor } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { useContacts } from './useContacts'

it('almacena el UUID generado y conserva el teléfono opcional', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok: true, json: async () => [] }),
  )
  const id = 'b2f8f397-4296-4f7e-997b-094aeac2a85b'
  vi.spyOn(crypto, 'randomUUID').mockReturnValue(id)
  const { result } = renderHook(() => useContacts())
  await waitFor(() => expect(result.current.loading).toBe(false))
  act(() =>
    result.current.addContact({
      name: 'Laura',
      email: 'laura@example.com',
      department: 'Soporte',
    }),
  )
  expect(result.current.contacts).toEqual([
    { id, name: 'Laura', email: 'laura@example.com', department: 'Soporte' },
  ])
})

it('cancela la petición al desmontar', () => {
  const request = vi.fn().mockReturnValue(new Promise(() => {}))
  vi.stubGlobal('fetch', request)
  const { unmount } = renderHook(() => useContacts())
  const signal = request.mock.calls[0][1].signal as AbortSignal
  unmount()
  expect(signal.aborted).toBe(true)
})
