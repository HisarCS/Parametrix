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

const ExtrudedTriangle = ({ position, side1, side2, side3, depth, rotation }) => {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[side2, side3, depth]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

const ExtrudedEllipse = ({ position, majorRadius, minorRadius, height, rotation }) => {
  return (
    <mesh position={position} rotation={rotation}>
      <cylinderGeometry args={[majorRadius, minorRadius, height, 32]} />
      <meshStandardMaterial color="purple" />
    </mesh>
  );
};

const ExtrudedPolygon = ({ position, radius, sides, depth, rotation }) => {
  return (
    <mesh position={position} rotation={rotation}>
      <cylinderGeometry args={[radius, radius, depth, sides]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

const ExtrudedCone = ({ position, radius, height, rotation }) => {
  return (
    <mesh position={position} rotation={rotation}>
      <coneGeometry args={[radius, height, 32]} />
      <meshStandardMaterial color="purple" />
    </mesh>
  );
};

const CoordinatePlane3D = () => {
  const gridSize = 50;
  const lineLength = gridSize * 2;

  return (
    <group>
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

const ThreeDView = ({ shapes = [] }) => {
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

            let position = [x, y, z];
            let rotation = [0, 0, 0];
            
            switch (plane) {
              case "XYConstructionPlane":
                position = [x, y, z + (height / 2)];
                rotation = [Math.PI / 2, 0, 0];
                break;
              case "YZConstructionPlane":
                position = [x + (height / 2), y, z];
                rotation = [0, 0, Math.PI / 2];
                break;
              case "XZConstructionPlane":
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

            let position = [x, y, z];
            let rotation = [0, 0, 0];
            
            switch (plane) {
              case "XYConstructionPlane":
                position = [x, y, z + (depth / 2)];
                rotation = [0, 0, 0];
                break;
              case "YZConstructionPlane":
                position = [x + (depth / 2), y, z];
                rotation = [0, 0, Math.PI / 2];
                break;
              case "XZConstructionPlane":
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
          } else if (shapeType === "triangle") {
            const { side1, side2, side3 } = parameters;
            const depth = shape.depth || DEFAULT_EXTRUSION;

            let position = [x, y, z];
            let rotation = [0, 0, 0];
            
            switch (plane) {
              case "XYConstructionPlane":
                position = [x + (side2 / 2), y + (side3 / 2), z + (depth / 2)];
                rotation = [0, 0, 0];
                break;
              case "YZConstructionPlane":
                position = [x + (depth / 2), y + (side2 / 2), z + (side3 / 2)];
                rotation = [0, Math.PI / 2, 0];
                break;
              case "XZConstructionPlane":
                position = [x + (side2 / 2), y + (depth / 2), z + (side3 / 2)];
                rotation = [Math.PI / 2, 0, 0];
                break;
            }

            return (
              <ExtrudedTriangle
                key={index}
                position={position}
                side1={side1}
                side2={side2}
                side3={side3}
                depth={depth}
                rotation={rotation}
              />
            );
          } else if (shapeType === "ellipse") {
            const { major_radius, minor_radius } = parameters;
            const height = shape.height || DEFAULT_EXTRUSION;

            let position = [x, y, z];
            let rotation = [0, 0, 0];
            
            switch (plane) {
              case "XYConstructionPlane":
                position = [x, y, z + (height / 2)];
                rotation = [0, 0, 0];
                break;
              case "YZConstructionPlane":
                position = [x + (height / 2), y, z];
                rotation = [0, 0, Math.PI / 2];
                break;
              case "XZConstructionPlane":
                position = [x, y + (height / 2), z];
                rotation = [Math.PI / 2, 0, 0];
                break;
            }

            return (
              <ExtrudedEllipse
                key={index}
                position={position}
                majorRadius={major_radius}
                minorRadius={minor_radius}
                height={height}
                rotation={rotation}
              />
            );
          } else if (shapeType === "polygon") {
            const { radius, sides } = parameters;
            const depth = shape.depth || DEFAULT_EXTRUSION;

            let position = [x, y, z];
            let rotation = [0, 0, 0];
            
            switch (plane) {
              case "XYConstructionPlane":
                position = [x, y, z + (depth / 2)];
                rotation = [0, 0, 0];
                break;
              case "YZConstructionPlane":
                position = [x + (depth / 2), y, z];
                rotation = [0, 0, Math.PI / 2];
                break;
              case "XZConstructionPlane":
                position = [x, y + (depth / 2), z];
                rotation = [Math.PI / 2, 0, 0];
                break;
              case "ZXConstructionPlane":
                position = [x, y + (depth / 2), z];
                rotation = [Math.PI / 2, 0, 0];
                break;
            }

            return (
              <ExtrudedPolygon
                key={index}
                position={position}
                radius={radius}
                sides={sides}
                depth={depth}
                rotation={rotation}
              />
            );
          } else if (shapeType === "cone") {
            const { radius, height } = parameters;

            let position = [x, y, z];
            let rotation = [0, 0, 0];
            
            switch (plane) {
              case "XYConstructionPlane":
                position = [x, y, z + (height / 2)];
                rotation = [0, 0, 0];
                break;
              case "YZConstructionPlane":
                position = [x + (height / 2), y, z];
                rotation = [0, 0, -Math.PI / 2];
                break;
              case "XZConstructionPlane":
                position = [x, y + (height / 2), z];
                rotation = [0, 0, 0];
                break;
              case "ZXConstructionPlane":
                position = [x, y + (height / 2), z];
                rotation = [0, 0, 0];
                break;
            }

            return (
              <ExtrudedCone
                key={index}
                position={position}
                radius={radius}
                height={height}
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
