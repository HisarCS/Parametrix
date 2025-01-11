import React from "react";
import { Canvas } from "@react-three/fiber";

const DEFAULT_EXTRUSION = 1;

const ExtrudedCircle = ({ position, radius, height }) => {
  return (
    <mesh position={position}>
      <cylinderGeometry args={[radius, radius, height, 32]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
};

const ExtrudedRectangle = ({ position, width, height, depth }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
};

const CoordinatePlane3D = () => {
  const gridSize = 20;

  return (
    <group>
      {/* X-axis */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array([-gridSize, 0, 0, gridSize, 0, 0])}
            itemSize={3}
            count={2}
          />
        </bufferGeometry>
        <lineBasicMaterial color="gray" />
      </line>
      {/* Y-axis */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array([0, -gridSize, 0, 0, gridSize, 0])}
            itemSize={3}
            count={2}
          />
        </bufferGeometry>
        <lineBasicMaterial color="gray" />
      </line>
      {/* Z-axis */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array([0, 0, -gridSize, 0, 0, gridSize])}
            itemSize={3}
            count={2}
          />
        </bufferGeometry>
        <lineBasicMaterial color="gray" />
      </line>
    </group>
  );
};

const ThreeDView = ({ shapes }) => {
  return (
    <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} />
      <CoordinatePlane3D />
      {shapes.map((shape, index) => {
        if (shape.extruded) {
          if (shape.shape === "circle") {
            const { radius } = shape.parameters;
            const height = shape.height || DEFAULT_EXTRUSION;
            const position = [
              shape.coordinates[0],
              shape.coordinates[1],
              shape.coordinates[2] + height / 2,
            ];
            return (
              <ExtrudedCircle
                key={index}
                position={position}
                radius={radius}
                height={height}
              />
            );
          } else if (shape.shape === "rectangle") {
            const { width, height } = shape.parameters;
            const depth = shape.height || DEFAULT_EXTRUSION;
            const position = [
              shape.coordinates[0],
              shape.coordinates[1],
              shape.coordinates[2] + depth / 2,
            ];
            return (
              <ExtrudedRectangle
                key={index}
                position={position}
                width={width}
                height={height}
                depth={depth}
              />
            );
          }
        }
        return null;
      })}
    </Canvas>
  );
};

export default ThreeDView;
