import React from "react";
import { Canvas } from "@react-three/fiber";

const DEFAULT_EXTRUSION = 1;

const ExtrudedCircle = ({ position, radius, height, rotation }) => {
  return (
    <mesh position={position} rotation={rotation}>
      <cylinderGeometry args={[radius, radius, height, 32]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
};

const ExtrudedRectangle = ({ position, width, height, depth, rotation }) => {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
};

const CoordinatePlane3D = () => {
  const gridSize = 50;
  const lineLength = gridSize * 2;

  return (
    <group>
      {/* X-axis */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array([-lineLength, 0, 0, lineLength, 0, 0])}
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
            array={new Float32Array([0, -lineLength, 0, 0, lineLength, 0])}
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
            array={new Float32Array([0, 0, -lineLength, 0, 0, lineLength])}
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
    <Canvas camera={{ position: [20, 20, 20], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[20, 20, 20]} />
      <CoordinatePlane3D />
      {shapes.map((shape, index) => {
        if (shape.extruded) {
          const { coordinates, parameters, plane, shape: shapeType } = shape;
          const [x, y, z] = coordinates;

          if (shapeType === "circle") {
            const { radius } = parameters;
            const height = shape.height || DEFAULT_EXTRUSION;

            // Calculate position and rotation based on plane and extrusion
            let position = [x, y, z];
            let rotation = [0, 0, 0];
            
            switch (plane) {
              case "XYConstructionPlane":
                // Extrude along Z axis
                position = [x, y, z + (height / 2)];
                rotation = [Math.PI / 2, 0, 0];
                break;
              case "YZConstructionPlane":
                // Extrude along X axis
                position = [x + (height / 2), y, z];
                rotation = [0, 0, Math.PI / 2];
                break;
              case "XZConstructionPlane":
                // Extrude along Y axis
                position = [x, y + (height / 2), z];
                rotation = [0, 0, 0];
                break;
            }

            return (
              <ExtrudedCircle
                key={index}
                position={position}
                radius={radius}
                height={height}
                rotation={rotation}
              />
            );
          } else if (shapeType === "rectangle") {
            const { width, height: rectHeight } = parameters;
            const depth = shape.depth || DEFAULT_EXTRUSION;

            // Calculate position and rotation based on plane and extrusion
            let position = [x, y, z];
            let rotation = [0, 0, 0];
            
            switch (plane) {
              case "XYConstructionPlane":
                // Extrude along Z axis
                position = [x, y, z + (depth / 2)];
                rotation = [0, 0, 0];
                break;
              case "YZConstructionPlane":
                // Extrude along X axis
                position = [x + (depth / 2), y, z];
                rotation = [0, 0, Math.PI / 2];
                break;
              case "XZConstructionPlane":
                // Extrude along Y axis
                position = [x, y + (depth / 2), z];
                rotation = [Math.PI / 2, 0, 0];
                break;
            }

            return (
              <ExtrudedRectangle
                key={index}
                position={position}
                width={width}
                height={rectHeight}
                depth={depth}
                rotation={rotation}
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
