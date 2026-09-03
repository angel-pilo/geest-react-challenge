import type { Department } from '../types/contact'

const styles: Record<Department, string> = {
  Ventas: 'bg-emerald-50 text-emerald-800 ring-emerald-100',
  Desarrollo: 'bg-blue-50 text-blue-800 ring-blue-100',
  Marketing: 'bg-violet-50 text-violet-800 ring-violet-100',
  Soporte: 'bg-amber-50 text-amber-800 ring-amber-100',
}

export function DepartmentBadge({ department }: { department: Department }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${styles[department]}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {department}
    </span>
  )
}
