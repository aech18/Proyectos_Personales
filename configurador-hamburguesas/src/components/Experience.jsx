import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import BurgerStack from './BurgerStack'

const PEDESTAL_HEIGHT = 0.5
const PEDESTAL_RADIUS = 1.2

function Pedestal() {
  return (
    <mesh position={[0, PEDESTAL_HEIGHT / 2, 0]}>
      <cylinderGeometry args={[PEDESTAL_RADIUS, PEDESTAL_RADIUS, PEDESTAL_HEIGHT, 32]} />
      <meshStandardMaterial color="#8B5E3C" roughness={0.7} metalness={0.1} />
    </mesh>
  )
}

export default function Experience({ ingredients, ingredientHeights }) {
  return (
    <Canvas
      camera={{ position: [4, 3, 4], fov: 45 }}
      shadows
      className="w-full h-full"
    >
      <color attach="background" args={['#1a1a2e']} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-3, 4, -2]} intensity={0.4} />
      <hemisphereLight args={['#ffeeb1', '#080820', 0.6]} />
      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={10}
        maxPolarAngle={Math.PI / 2.1}
      />
      <Pedestal />
      <BurgerStack
        ingredients={ingredients}
        ingredientHeights={ingredientHeights}
        baseY={PEDESTAL_HEIGHT}
      />
    </Canvas>
  )
}
