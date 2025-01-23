import React, { useRef, useEffect } from "react";

const CoordinatePlane = ({ shapes }) => {
  const canvasRef = useRef(null);

  // Constants for canvas configuration
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 700;
  const UNIT = 16;
  const STEPS = 100; // For smooth curves

  // Shape colors
  const COLORS = {
    circle: "blue",
    rectangle: "green",
    triangle: "red",
    ellipse: "purple",
    axes: "gray"
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // 3D to 2D transformation function
    const transform3DTo2D = (x, y, z) => {
      const angleX = Math.PI / 6;
      const angleZ = Math.PI / 6;

      const transformedX = x * Math.cos(angleZ) - z * Math.sin(angleZ);
      const transformedY =
        y * Math.cos(angleX) - 
        (x * Math.sin(angleZ) + z * Math.cos(angleZ)) * Math.sin(angleX);

      return {
        x: centerX + transformedX * UNIT,
        y: centerY - transformedY * UNIT,
      };
    };

    // Draw coordinate system axes
    const drawAxes = () => {
      ctx.strokeStyle = COLORS.axes;
      ctx.lineWidth = 1;

      // Draw X axis
      const xStart = transform3DTo2D(-64, 0, 0);
      const xEnd = transform3DTo2D(64, 0, 0);
      ctx.beginPath();
      ctx.moveTo(xStart.x, xStart.y);
      ctx.lineTo(xEnd.x, xEnd.y);
      ctx.stroke();

      // Draw Y axis
      const yStart = transform3DTo2D(0, -64, 0);
      const yEnd = transform3DTo2D(0, 64, 0);
      ctx.beginPath();
      ctx.moveTo(yStart.x, yStart.y);
      ctx.lineTo(yEnd.x, yEnd.y);
      ctx.stroke();

      // Draw Z axis
      const zStart = transform3DTo2D(0, 0, -64);
      const zEnd = transform3DTo2D(0, 0, 64);
      ctx.beginPath();
      ctx.moveTo(zStart.x, zStart.y);
      ctx.lineTo(zEnd.x, zEnd.y);
      ctx.stroke();
    };

    // Shape drawing functions
    const drawCircle = (shape) => {
      const { radius } = shape.parameters;
      let [x, y, z] = shape.coordinates;
      const points = [];

      for (let i = 0; i < STEPS; i++) {
        const angle = (i / STEPS) * Math.PI * 2;
        let px, py, pz;

        switch (shape.plane) {
          case "XYConstructionPlane":
            px = x + radius * Math.cos(angle);
            py = y + radius * Math.sin(angle);
            pz = z;
            break;
          case "XZConstructionPlane":
            px = x + radius * Math.cos(angle);
            py = y;
            pz = z + radius * Math.sin(angle);
            break;
          case "YZConstructionPlane":
            px = x;
            py = y + radius * Math.cos(angle);
            pz = z + radius * Math.sin(angle);
            break;
        }

        points.push(transform3DTo2D(px, py, pz));
      }

      drawPath(points, COLORS.circle);
    };

    const drawRectangle = (shape) => {
      const { width, height } = shape.parameters;
      const [x, y, z] = shape.coordinates;
      const corners = [];

      switch (shape.plane) {
        case "XYConstructionPlane":
          corners.push(
            transform3DTo2D(x, y, z),
            transform3DTo2D(x + width, y, z),
            transform3DTo2D(x + width, y + height, z),
            transform3DTo2D(x, y + height, z)
          );
          break;
        case "XZConstructionPlane":
          corners.push(
            transform3DTo2D(x, y, z),
            transform3DTo2D(x + width, y, z),
            transform3DTo2D(x + width, y, z + height),
            transform3DTo2D(x, y, z + height)
          );
          break;
        case "YZConstructionPlane":
          corners.push(
            transform3DTo2D(x, y, z),
            transform3DTo2D(x, y + width, z),
            transform3DTo2D(x, y + width, z + height),
            transform3DTo2D(x, y, z + height)
          );
          break;
      }

      drawPath(corners, COLORS.rectangle);
    };

    const drawTriangle = (shape) => {
      const { side1, side2, side3 } = shape.parameters;
      let [x, y, z] = shape.coordinates;
      
      // Calculate angle using cosine law
      const angleA = Math.acos(
        (side2 * side2 + side3 * side3 - side1 * side1) / 
        (2 * side2 * side3)
      );

      const points = [];
      switch (shape.plane) {
        case "XYConstructionPlane":
          points.push(
            transform3DTo2D(x, y, z),
            transform3DTo2D(x + side2, y, z),
            transform3DTo2D(
              x + side3 * Math.cos(angleA),
              y + side3 * Math.sin(angleA),
              z
            )
          );
          break;
        case "XZConstructionPlane":
          points.push(
            transform3DTo2D(x, y, z),
            transform3DTo2D(x + side2, y, z),
            transform3DTo2D(
              x + side3 * Math.cos(angleA),
              y,
              z + side3 * Math.sin(angleA)
            )
          );
          break;
        case "YZConstructionPlane":
          points.push(
            transform3DTo2D(x, y, z),
            transform3DTo2D(x, y + side2, z),
            transform3DTo2D(
              x,
              y + side3 * Math.cos(angleA),
              z + side3 * Math.sin(angleA)
            )
          );
          break;
      }

      drawPath(points, COLORS.triangle);
    };

    const drawEllipse = (shape) => {
      const { major_radius, minor_radius } = shape.parameters;
      let [x, y, z] = shape.coordinates;
      const points = [];

      for (let i = 0; i < STEPS; i++) {
        const angle = (i / STEPS) * Math.PI * 2;
        let px, py, pz;

        switch (shape.plane) {
          case "XYConstructionPlane":
            px = x + major_radius * Math.cos(angle);
            py = y + minor_radius * Math.sin(angle);
            pz = z;
            break;
          case "XZConstructionPlane":
            px = x + major_radius * Math.cos(angle);
            py = y;
            pz = z + minor_radius * Math.sin(angle);
            break;
          case "YZConstructionPlane":
            px = x;
            py = y + major_radius * Math.cos(angle);
            pz = z + minor_radius * Math.sin(angle);
            break;
        }

        points.push(transform3DTo2D(px, py, pz));
      }

      drawPath(points, COLORS.ellipse);
    };

    // Helper function to draw paths
    const drawPath = (points, color) => {
      ctx.strokeStyle = color;
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
    };

    // Main drawing function
    const drawShapes = () => {
      shapes.forEach((shape) => {
        switch (shape.shape) {
          case "circle":
            drawCircle(shape);
            break;
          case "rectangle":
            drawRectangle(shape);
            break;
          case "triangle":
            drawTriangle(shape);
            break;
          case "ellipse":
            drawEllipse(shape);
            break;
        }
      });
    };

    // Clear canvas and draw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAxes();
    drawShapes();
  }, [shapes]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        border: "2px solid black",
        margin: "20px",
      }} 
    />
  );
};

export default CoordinatePlane;
