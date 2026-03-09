import { useState } from 'react'
import './index.css'
import Experience from './components/Experience'
import Interface from './components/Interface'

const INGREDIENT_HEIGHTS = {
  pan_base: 0.3,
  carne: 0.4,
  queso: 0.1,
}

function App() {
  const [ingredients, setIngredients] = useState([])

  const addIngredient = (type) => {
    setIngredients((prev) => [...prev, type])
  }

  const resetBurger = () => {
    setIngredients([])
  }

  return (
    <div className="relative w-full h-screen">
      <Experience
        ingredients={ingredients}
        ingredientHeights={INGREDIENT_HEIGHTS}
      />
      <Interface
        onAddIngredient={addIngredient}
        onReset={resetBurger}
        ingredients={ingredients}
      />
    </div>
  )
}

export default App
