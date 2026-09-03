import type { Contact } from '../types/contact'
import { DepartmentBadge } from './DepartmentBadge'

export function ContactRow({ contact }: { contact: Contact }) {
  const initials = contact.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('')
  return <li className="grid gap-3 border-t border-slate-100 px-5 py-5 transition-colors hover:bg-slate-50/70 md:grid-cols-[1.15fr_1.4fr_1fr_0.8fr] md:items-center md:gap-4 md:px-7">
    <div className="flex min-w-0 items-center gap-3"><span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#edf1ed] text-xs font-semibold text-brand">{initials}</span><span className="break-words text-sm font-semibold">{contact.name}</span></div>
    <div className="min-w-0 break-words text-sm text-slate-600"><span className="mr-2 text-xs text-slate-500 md:hidden">Email</span>{contact.email}</div>
    <div className="text-sm text-slate-600"><span className="mr-2 text-xs text-slate-500 md:hidden">Teléfono</span>{contact.phone || 'Sin teléfono'}</div>
    <div><DepartmentBadge department={contact.department} /></div>
  </li>
}
