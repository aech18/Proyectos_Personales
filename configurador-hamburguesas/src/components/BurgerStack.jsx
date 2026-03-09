import { useMemo } from 'react'

function BunBase({ position }) {
  return (
    <mesh position={position}>
      <cylinderGeometry args={[1.0, 1.0, 0.3, 32]} />
      <meshStandardMaterial color="#D2A24C" roughness={0.6} />
    </mesh>
  )
}

function Meat({ position }) {
  return (
    <mesh position={position}>
      <cylinderGeometry args={[0.9, 0.9, 0.4, 32]} />
      <meshStandardMaterial color="#5C3317" roughness={0.8} />
    </mesh>
  )
}

function Cheese({ position }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[1.8, 0.1, 1.8]} />
      <meshStandardMaterial color="#FFC107" roughness={0.4} metalness={0.1} />
    </mesh>
  )
}

const INGREDIENT_COMPONENTS = {
  pan_base: BunBase,
  carne: Meat,
  queso: Cheese,
}

export default function BurgerStack({ ingredients, ingredientHeights, baseY }) {
  const positions = useMemo(() => {
    const result = ingredients.reduce(
      (acc, type) => {
        const height = ingredientHeights[type]
        const positionY = acc.currentY + height / 2
        return {
          currentY: acc.currentY + height,
          items: [...acc.items, positionY],
        }
      },
      { currentY: baseY, items: [] }
    )
    return result.items
  }, [ingredients, ingredientHeights, baseY])

  return (
    <group>
      {ingredients.map((type, index) => {
        const Component = INGREDIENT_COMPONENTS[type]
        if (!Component) return null
        return <Component key={`${type}-${index}`} position={[0, positions[index], 0]} />
      })}
    </group>
  )
}
