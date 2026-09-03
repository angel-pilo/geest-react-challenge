import { Icon } from './Icon'

export function EmptyState({
  filtered = false,
  onAction,
}: {
  filtered?: boolean
  onAction?: () => void
}) {
  return (
    <section className="flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
      <span className="mb-5 rounded-2xl bg-[#eef3ef] p-4 text-brand">
        <Icon name={filtered ? 'search' : 'users'} width="28" height="28" />
      </span>
      <h2 className="text-lg font-semibold">
        {filtered ? 'No encontramos resultados' : 'Aún no hay contactos'}
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {filtered
          ? 'Prueba con otro nombre o departamento para encontrar a quien buscas.'
          : 'Agrega un contacto para empezar.'}
      </p>
      {onAction && (
        <button
          className="mt-6 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900"
          onClick={onAction}
        >
          {filtered ? 'Limpiar filtros' : 'Agregar contacto'}
        </button>
      )}
    </section>
  )
}
