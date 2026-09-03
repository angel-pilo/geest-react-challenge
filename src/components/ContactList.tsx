import type { Contact } from '../types/contact'
import { ContactRow } from './ContactRow'

export function ContactList({
  contacts,
  onDelete,
}: {
  contacts: Contact[]
  onDelete: (id: string) => void
}) {
  return (
    <section
      aria-label="Directorio de contactos"
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div
        aria-hidden="true"
        className="hidden grid-cols-[1.15fr_1.4fr_1fr_0.8fr_2.5rem] gap-4 bg-slate-50/80 px-7 py-3 text-[11px] font-semibold tracking-wider text-slate-500 uppercase lg:grid"
      >
        <span>Nombre</span>
        <span>Email</span>
        <span>Teléfono</span>
        <span>Departamento</span>
        <span className="sr-only">Acciones</span>
      </div>
      <ul aria-label="Contactos">
        {contacts.map((contact) => (
          <ContactRow key={contact.id} contact={contact} onDelete={onDelete} />
        ))}
      </ul>
    </section>
  )
}
