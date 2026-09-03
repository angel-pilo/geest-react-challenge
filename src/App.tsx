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
  const { contacts, loading, error, retry, addContact, deleteContact } = useContacts()
  const [modalOpen, setModalOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState<Department | 'Todos'>('Todos')
  const filteredContacts = contacts.filter((contact) => contact.name.toLocaleLowerCase('es').includes(query.trim().toLocaleLowerCase('es')) && (department === 'Todos' || contact.department === department))
  function clearFilters() { setQuery(''); setDepartment('Todos') }

  return <div className="min-h-screen">
    <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-4">Ir al contenido</a>
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-10"><span className="text-3xl font-extrabold tracking-[-0.07em] text-brand">geest<span className="text-[#91b894]">.</span></span><span className="hidden items-center gap-2 border-l border-slate-200 pl-8 text-sm text-slate-500 sm:flex"><Icon name="grid" width="16" height="16" />Espacio de trabajo</span></div>
        <span className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600"><span className="size-1.5 rounded-full bg-emerald-600" />Directorio del equipo</span>
      </div>
    </header>
    <main id="main" className="mx-auto max-w-7xl px-5 pt-8 pb-12 sm:px-8 sm:pt-10">
      <div className="mb-8 flex items-center gap-2 text-xs text-slate-500"><span>Espacio de trabajo</span><Icon name="arrow" width="12" height="12" /><span className="text-brand">Contactos</span></div>
      <div className="mb-9 flex flex-wrap items-center justify-between gap-5">
        <div><div className="mb-2 flex items-center gap-3"><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Contactos</h1><span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-sm text-slate-600">{loading ? '…' : contacts.length}</span></div><p className="text-sm leading-6 text-slate-500">Las personas de tu equipo, en un solo lugar.</p></div>
        <button onClick={() => setModalOpen(true)} disabled={loading || Boolean(error)} className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-900 disabled:bg-slate-200 disabled:text-slate-500"><Icon name="plus" width="18" height="18" />Agregar contacto</button>
      </div>
      <ContactFilters query={query} department={department} onQueryChange={setQuery} onDepartmentChange={setDepartment} />
      <div className="mb-5 flex items-center justify-between"><h2 className="text-sm font-semibold">Tu directorio</h2><p role="status" aria-atomic="true" className="text-xs text-slate-500">{loading ? 'Cargando…' : error ? 'Directorio no disponible' : `${filteredContacts.length} ${filteredContacts.length === 1 ? 'contacto' : 'contactos'} de ${contacts.length}`}</p></div>
      {loading ? <ContactSkeleton /> : error ? <section role="alert" className="rounded-xl border border-red-200 bg-red-50 p-8"><h2 className="font-semibold">No pudimos cargar los contactos</h2><p className="mt-2 text-sm">{error}</p><button onClick={retry} className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm text-white">Reintentar</button></section> : !contacts.length ? <EmptyState onAction={() => setModalOpen(true)} /> : filteredContacts.length ? <ContactList contacts={filteredContacts} onDelete={deleteContact} /> : <EmptyState filtered onAction={clearFilters} />}
      <footer className="mt-7 flex flex-wrap justify-between gap-3 text-xs text-slate-500"><span>Un equipo conectado empieza con un buen directorio.</span><span className="flex items-center gap-1.5"><Icon name="users" width="14" height="14" />Hecho para trabajar juntos</span></footer>
    </main>
    {modalOpen && <ContactFormModal onClose={() => setModalOpen(false)} onAdd={addContact} />}
  </div>
}
