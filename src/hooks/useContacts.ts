import { useEffect, useState } from 'react'
import { isContactArray, type Contact } from '../types/contact'

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}data.json`, { signal: controller.signal })
        if (!response.ok) throw new Error('No se pudo cargar el directorio.')
        const data: unknown = await response.json()
        if (!isContactArray(data)) throw new Error('El archivo de contactos tiene un formato inválido.')
        if (!controller.signal.aborted) setContacts(data)
      } catch (cause) {
        if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : 'No se pudo cargar el directorio.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    void load()
    return () => controller.abort()
  }, [attempt])

  function retry() {
    setError(null)
    setLoading(true)
    setAttempt((value) => value + 1)
  }

  function addContact(values: Omit<Contact, 'id'>) {
    const contact = { ...values, id: crypto.randomUUID() }
    setContacts((current) => [contact, ...current])
  }

  function deleteContact(id: string) {
    setContacts((current) => current.filter((contact) => contact.id !== id))
  }

  return { contacts, loading, error, retry, addContact, deleteContact }
}
