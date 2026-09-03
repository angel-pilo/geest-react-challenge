import { useEffect, useRef, type KeyboardEvent } from 'react'
import { useFormik } from 'formik'
import { departments, type Contact, type Department } from '../types/contact'
import { contactSchema, type ContactFormValues } from '../validation/contactSchema'
import { Icon } from './Icon'

type Props = { onClose: () => void; onAdd: (contact: Omit<Contact, 'id'>) => void }
const inputClass = 'mt-2 w-full rounded-lg border bg-white px-3.5 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-2 focus:outline-offset-1 focus:outline-brand/20'

export function ContactFormModal({ onClose, onAdd }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const pointerStartedOutside = useRef(false)
  const formik = useFormik<ContactFormValues>({
    initialValues: { name: '', email: '', phone: '', department: '' },
    validationSchema: contactSchema,
    validateOnMount: true,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit(values, helpers) {
      try {
        onAdd({ name: values.name.trim(), email: values.email.trim(), phone: values.phone.trim() || undefined, department: values.department as Department })
        helpers.resetForm()
        onClose()
      } catch {
        helpers.setStatus('No pudimos agregar el contacto. Inténtalo de nuevo.')
        helpers.setSubmitting(false)
      }
    },
  })

  useEffect(() => {
    const element = dialog.current!
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    element.showModal()
    element.querySelector<HTMLInputElement>('#name')?.focus()
    return () => {
      element.close()
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [])

  function visibleError(field: keyof ContactFormValues) {
    return (formik.touched[field] || formik.values[field] !== '') ? formik.errors[field] : undefined
  }
  const requiredEmpty = !formik.values.name.trim() || !formik.values.email.trim() || !formik.values.department

  function keepFocusInside(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return
    const controls = event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), input, select')
    const first = controls[0]
    const last = controls[controls.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return <dialog ref={dialog} aria-labelledby="contact-modal-title" aria-describedby="contact-modal-description" onKeyDown={keepFocusInside} onCancel={(event) => { event.preventDefault(); onClose() }}
    onPointerDown={(event) => { pointerStartedOutside.current = event.target === event.currentTarget }}
    onClick={(event) => { if (pointerStartedOutside.current && event.target === event.currentTarget) onClose(); pointerStartedOutside.current = false }}
    className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl border-0 bg-white p-0 text-slate-800 shadow-2xl backdrop:bg-slate-950/40 backdrop:backdrop-blur-xs">
    <div className="p-6 sm:p-8">
      <div className="mb-5 flex items-start justify-between"><span className="rounded-xl bg-[#edf4ef] p-3 text-brand"><Icon name="users" width="24" height="24" /></span><button type="button" aria-label="Cerrar modal" onClick={onClose} className="-mr-2 rounded-lg p-2.5 text-slate-500 hover:bg-slate-100"><Icon name="close" /></button></div>
      <h2 id="contact-modal-title" className="text-2xl font-semibold tracking-tight">Agregar contacto</h2>
      <p id="contact-modal-description" className="mt-2 text-sm leading-6 text-slate-500">Suma a alguien a tu directorio. Los campos con * son obligatorios.</p>
      <form onSubmit={formik.handleSubmit} noValidate className="mt-6 space-y-4">
        {([{ field: 'name', label: 'Nombre', type: 'text', placeholder: 'Ej. Ana García', autocomplete: 'name', required: true }, { field: 'email', label: 'Email', type: 'email', placeholder: 'nombre@empresa.com', autocomplete: 'email', required: true }, { field: 'phone', label: 'Teléfono', type: 'tel', placeholder: 'Ej. +52 55 1234 5678', autocomplete: 'tel', required: false }] as const).map(({ field, label, type, placeholder, autocomplete, required }) => {
          const error = visibleError(field)
          return <div key={field}><label htmlFor={field} className="text-sm font-medium">{label}{required ? <span className="text-brand"> *</span> : <span className="ml-2 text-xs font-normal text-slate-500">Opcional</span>}</label><input id={field} type={type} autoComplete={autocomplete} required={required} placeholder={placeholder} {...formik.getFieldProps(field)} aria-invalid={Boolean(error)} aria-describedby={error ? `${field}-error` : undefined} className={`${inputClass} ${error ? 'border-red-500' : 'border-slate-300'}`} />{error && <p id={`${field}-error`} aria-live="polite" className="mt-1.5 text-xs text-red-700">{error}</p>}</div>
        })}
        <div><label htmlFor="department" className="text-sm font-medium">Departamento <span className="text-brand">*</span></label><select id="department" required {...formik.getFieldProps('department')} aria-invalid={Boolean(visibleError('department'))} aria-describedby={visibleError('department') ? 'department-error' : undefined} className={`${inputClass} ${visibleError('department') ? 'border-red-500' : 'border-slate-300'}`}><option value="">Selecciona un departamento</option>{departments.map((department) => <option key={department}>{department}</option>)}</select>{visibleError('department') && <p id="department-error" aria-live="polite" className="mt-1.5 text-xs text-red-700">{visibleError('department')}</p>}</div>
        {formik.status && <p role="alert" className="text-sm text-red-700">{formik.status}</p>}
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-6"><button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium hover:bg-slate-50">Cancelar</button><button type="submit" disabled={!formik.isValid || requiredEmpty || formik.isSubmitting} className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900 disabled:bg-slate-200 disabled:text-slate-500">{formik.isSubmitting ? 'Guardando…' : 'Guardar contacto'}</button></div>
      </form>
    </div>
  </dialog>
}
