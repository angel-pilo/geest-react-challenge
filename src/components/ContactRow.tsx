import type { Contact } from '../types/contact'
import { DepartmentBadge } from './DepartmentBadge'
import { Icon } from './Icon'

export function ContactRow({
  contact,
  onDelete,
}: {
  contact: Contact
  onDelete: (id: string) => void
}) {
  const initials = contact.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
  return (
    <li className="relative grid gap-3 border-t border-slate-100 px-5 py-5 transition-colors hover:bg-slate-50/70 lg:grid-cols-[1.15fr_1.4fr_1fr_0.8fr_2.5rem] lg:items-center lg:gap-4 lg:px-7">
      <div className="flex min-w-0 items-center gap-3 pr-10 lg:pr-0">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#edf1ed] text-xs font-semibold text-brand"
        >
          {initials}
        </span>
        <span className="min-w-0 break-words text-sm font-semibold">
          {contact.name}
        </span>
      </div>
      <div className="min-w-0 break-words text-sm text-slate-600">
        <span className="mr-2 text-xs text-slate-500 lg:hidden">Email</span>
        {contact.email}
      </div>
      <div className="min-w-0 break-words text-sm text-slate-600">
        <span className="mr-2 text-xs text-slate-500 lg:hidden">Teléfono</span>
        {contact.phone || 'Sin teléfono'}
      </div>
      <div>
        <DepartmentBadge department={contact.department} />
      </div>
      <button
        type="button"
        aria-label={`Eliminar a ${contact.name}`}
        onClick={() => onDelete(contact.id)}
        className="absolute top-5 right-4 flex size-10 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-700 focus:text-red-700 lg:static"
      >
        <Icon name="trash" width="18" height="18" />
      </button>
    </li>
  )
}
