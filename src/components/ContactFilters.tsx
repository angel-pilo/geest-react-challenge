import { departments, type Department } from '../types/contact'
import { Icon } from './Icon'

type Props = {
  query: string
  department: Department | 'Todos'
  onQueryChange: (query: string) => void
  onDepartmentChange: (department: Department | 'Todos') => void
}

export function ContactFilters({
  query,
  department,
  onQueryChange,
  onDepartmentChange,
}: Props) {
  return (
    <div className="mb-7 space-y-5 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="relative max-w-md">
        <label htmlFor="search" className="sr-only">
          Buscar por nombre
        </label>
        <span className="pointer-events-none absolute top-3 left-3.5 text-slate-400">
          <Icon name="search" />
        </span>
        <input
          id="search"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Buscar por nombre…"
          className="w-full rounded-lg border border-slate-300 bg-slate-50/60 py-3 pr-4 pl-11 text-sm placeholder:text-slate-500 focus:border-brand focus:bg-white focus:outline-2 focus:outline-offset-1 focus:outline-brand/20"
        />
      </div>
      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Filtrar por departamento"
      >
        <span className="mr-2 w-full pb-1 text-xs font-medium text-slate-500 sm:w-auto sm:pb-0">
          Departamento
        </span>
        {(['Todos', ...departments] as const).map((item) => (
          <button
            key={item}
            aria-pressed={item === department}
            onClick={() => onDepartmentChange(item)}
            className={`min-h-10 rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors ${item === department ? 'border-brand bg-brand text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}
