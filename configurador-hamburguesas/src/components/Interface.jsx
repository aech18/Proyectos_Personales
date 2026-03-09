const BUTTONS = [
  { type: 'pan_base', label: '🍞 Añadir Pan Base', color: 'bg-amber-600 hover:bg-amber-700' },
  { type: 'carne', label: '🥩 Añadir Carne', color: 'bg-red-800 hover:bg-red-900' },
  { type: 'queso', label: '🧀 Añadir Queso', color: 'bg-yellow-500 hover:bg-yellow-600' },
]

export default function Interface({ onAddIngredient, onReset, ingredients }) {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      {/* Header */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg text-center">
          🍔 Configurador de Hamburguesas
        </h1>
      </div>

      {/* Side panel */}
      <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-auto">
        <div className="bg-black/70 backdrop-blur-sm rounded-2xl p-4 flex flex-col gap-3 w-56">
          <h2 className="text-white text-lg font-semibold text-center mb-1">
            Ingredientes
          </h2>

          {BUTTONS.map(({ type, label, color }) => (
            <button
              key={type}
              onClick={() => onAddIngredient(type)}
              className={`${color} text-white font-medium py-2.5 px-4 rounded-xl transition-colors cursor-pointer text-sm`}
            >
              {label}
            </button>
          ))}

          <hr className="border-white/20 my-1" />

          <button
            onClick={onReset}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-xl transition-colors cursor-pointer text-sm"
          >
            🗑️ Reiniciar
          </button>

          {/* Ingredient count */}
          <div className="text-white/70 text-xs text-center mt-1">
            {ingredients.length === 0
              ? 'Agrega ingredientes para construir tu hamburguesa'
              : `${ingredients.length} ingrediente${ingredients.length > 1 ? 's' : ''} agregado${ingredients.length > 1 ? 's' : ''}`}
          </div>
        </div>
      </div>
    </div>
  )
}
