import { useState } from 'react'
import { ContactList } from './components/ContactList'
import { ContactFormModal } from './components/ContactFormModal'
import { ContactFilters } from './components/ContactFilters'
import type { Department } from './types/contact'
import { ContactSkeleton } from './components/ContactSkeleton'
import { EmptyState } from './components/EmptyState'
import { Icon } from './components/Icon'
import { useContacts } from './hooks/useContacts'

export default function App() {
  const { contacts, loading, error, retry, addContact, deleteContact } =
    useContacts()
  const [modalOpen, setModalOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState<Department | 'Todos'>('Todos')
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name
        .toLocaleLowerCase('es')
        .includes(query.trim().toLocaleLowerCase('es')) &&
      (department === 'Todos' || contact.department === department),
  )
  function clearFilters() {
    setQuery('')
    setDepartment('Todos')
  }

  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-4"
      >
        Ir al contenido
      </a>
      <main
        id="main"
        className="mx-auto max-w-7xl px-5 pt-8 pb-12 sm:px-8 sm:pt-10"
      >
        <div className="mb-7 flex flex-wrap items-center justify-between gap-5">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Lista de contactos
          </h1>
          <button
            onClick={() => setModalOpen(true)}
            disabled={loading || Boolean(error)}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-900 disabled:bg-slate-200 disabled:text-slate-500"
          >
            <Icon name="plus" width="18" height="18" />
            Agregar contacto
          </button>
        </div>
        <ContactFilters
          query={query}
          department={department}
          onQueryChange={setQuery}
          onDepartmentChange={setDepartment}
        />
        <div className="mb-4">
          <p
            role="status"
            aria-atomic="true"
            className="text-xs text-slate-500"
          >
            {loading
              ? 'Cargando…'
              : error
                ? 'Lista no disponible'
                : `${filteredContacts.length} ${filteredContacts.length === 1 ? 'contacto' : 'contactos'} de ${contacts.length}`}
          </p>
        </div>
        {loading ? (
          <ContactSkeleton />
        ) : error ? (
          <section
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-8"
          >
            <h2 className="font-semibold">No pudimos cargar los contactos</h2>
            <p className="mt-2 text-sm">{error}</p>
            <button
              onClick={retry}
              className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm text-white"
            >
              Reintentar
            </button>
          </section>
        ) : !contacts.length ? (
          <EmptyState onAction={() => setModalOpen(true)} />
        ) : filteredContacts.length ? (
          <ContactList contacts={filteredContacts} onDelete={deleteContact} />
        ) : (
          <EmptyState filtered onAction={clearFilters} />
        )}
      </main>
      {modalOpen && (
        <ContactFormModal
          onClose={() => setModalOpen(false)}
          onAdd={addContact}
        />
      )}
    </div>
  )
}
