import React, { useRef, useEffect } from "react";

const CoordinatePlane = ({ shapes }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const unit = 20;

    // Function to convert 3D coordinates to 2D screen space
    const transform3DTo2D = (x, y, z) => {
      const angleX = Math.PI / 6;
      const angleZ = Math.PI / 6;

      const transformedX = x * Math.cos(angleZ) - z * Math.sin(angleZ);
      const transformedY =
        y * Math.cos(angleX) - (x * Math.sin(angleZ) + z * Math.cos(angleZ)) * Math.sin(angleX);

      return {
        x: centerX + transformedX * unit,
        y: centerY - transformedY * unit,
      };
    };

    // Draw axes on the canvas
    const drawAxes = () => {
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;

      const axes = [
        { start: [-15, 0, 0], end: [15, 0, 0] }, // X-axis
        { start: [0, -15, 0], end: [0, 15, 0] }, // Y-axis
        { start: [0, 0, -15], end: [0, 0, 15] }, // Z-axis
      ];

      axes.forEach(({ start, end }) => {
        const startPos = transform3DTo2D(...start);
        const endPos = transform3DTo2D(...end);
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(endPos.x, endPos.y);
        ctx.stroke();
      });
    };

    // Draw shapes based on the provided data
    const drawShapes = () => {
      shapes.forEach((shape) => {
        if (shape.shape === "circle") {
          const { radius } = shape.parameters;
          const [x, y, z] = shape.coordinates;
          const plane = shape.plane;

          const steps = 100;
          const points = [];

          for (let i = 0; i < steps; i++) {
            const angle = (i / steps) * Math.PI * 2;
            let px, py, pz;

            if (plane === "XYConstructionPlane") {
              px = x + radius * Math.cos(angle);
              py = y + radius * Math.sin(angle);
              pz = z;
            } else if (plane === "XZConstructionPlane") {
              px = x + radius * Math.cos(angle);
              py = y;
              pz = z + radius * Math.sin(angle);
            } else if (plane === "YZConstructionPlane") {
              px = x;
              py = y + radius * Math.cos(angle);
              pz = z + radius * Math.sin(angle);
            }

            points.push(transform3DTo2D(px, py, pz));
          }

          ctx.strokeStyle = "blue";
          ctx.lineWidth = 2;

          ctx.beginPath();
          points.forEach((point, index) => {
            if (index === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          });
          ctx.closePath();
          ctx.stroke();
        } else if (shape.shape === "rectangle") {
          const { width, height } = shape.parameters;
          const [x, y, z] = shape.coordinates;
          const plane = shape.plane;

          const corners = [];

          if (plane === "XYConstructionPlane") {
            corners.push(
              transform3DTo2D(x, y, z),
              transform3DTo2D(x + width, y, z),
              transform3DTo2D(x + width, y + height, z),
              transform3DTo2D(x, y + height, z)
            );
          } else if (plane === "XZConstructionPlane") {
            corners.push(
              transform3DTo2D(x, y, z),
              transform3DTo2D(x + width, y, z),
              transform3DTo2D(x + width, y, z + height),
              transform3DTo2D(x, y, z + height)
            );
          } else if (plane === "YZConstructionPlane") {
            corners.push(
              transform3DTo2D(x, y, z),
              transform3DTo2D(x, y + width, z),
              transform3DTo2D(x, y + width, z + height),
              transform3DTo2D(x, y, z + height)
            );
          }

          ctx.strokeStyle = "green";
          ctx.lineWidth = 2;

          ctx.beginPath();
          corners.forEach((corner, index) => {
            if (index === 0) {
              ctx.moveTo(corner.x, corner.y);
            } else {
              ctx.lineTo(corner.x, corner.y);
            }
          });
          ctx.closePath();
          ctx.stroke();
        }
      });
    };

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAxes();
    drawShapes();
  }, [shapes]);

  return <canvas ref={canvasRef} width={600} height={400} style={{ border: "1px solid black" }} />;
};

export default CoordinatePlane;
