export const departments = ['Ventas', 'Desarrollo', 'Marketing', 'Soporte'] as const
export type Department = (typeof departments)[number]

export type Contact = {
  id: string
  name: string
  email: string
  phone?: string
  department: Department
}

export function isContactArray(value: unknown): value is Contact[] {
  if (!Array.isArray(value)) return false
  const ids = new Set<string>()
  return value.every((item: unknown) => {
    if (typeof item !== 'object' || item === null) return false
    const contact = item as Record<string, unknown>
    const valid = typeof contact.id === 'string' && contact.id.trim() !== '' && !ids.has(contact.id)
      && typeof contact.name === 'string' && contact.name.trim() !== ''
      && typeof contact.email === 'string'
      && (contact.phone === undefined || typeof contact.phone === 'string')
      && departments.includes(contact.department as Department)
    if (valid) ids.add(contact.id as string)
    return valid
  })
}
