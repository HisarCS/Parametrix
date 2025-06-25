import React, { useRef, useEffect } from "react";

const CoordinatePlane2D = ({ shapes = [] }) => {
  const canvasRef = useRef(null);

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 700;
  const UNIT = 16;
  const STEPS = 100;

  const COLORS = {
    circle: "blue",
    rectangle: "green",
    triangle: "red",
    ellipse: "purple",
    cone: "purple",
    polygon: "orange",
    axes: "gray"
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

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

    const drawAxes = () => {
      ctx.strokeStyle = COLORS.axes;
      ctx.lineWidth = 1;

      const xStart = transform3DTo2D(-64, 0, 0);
      const xEnd = transform3DTo2D(64, 0, 0);
      ctx.beginPath();
      ctx.moveTo(xStart.x, xStart.y);
      ctx.lineTo(xEnd.x, xEnd.y);
      ctx.stroke();

      const yStart = transform3DTo2D(0, -64, 0);
      const yEnd = transform3DTo2D(0, 64, 0);
      ctx.beginPath();
      ctx.moveTo(yStart.x, yStart.y);
      ctx.lineTo(yEnd.x, yEnd.y);
      ctx.stroke();

      const zStart = transform3DTo2D(0, 0, -64);
      const zEnd = transform3DTo2D(0, 0, 64);
      ctx.beginPath();
      ctx.moveTo(zStart.x, zStart.y);
      ctx.lineTo(zEnd.x, zEnd.y);
      ctx.stroke();
    };

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

    const drawShapes = () => {
      shapes.forEach((shape) => {
        if (shape.shape === "circle") {
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
        } else if (shape.shape === "rectangle") {
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
        } else if (shape.shape === "triangle") {
          const { side1, side2, side3 } = shape.parameters;
          let [x, y, z] = shape.coordinates;
          
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
        } else if (shape.shape === "ellipse") {
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
        } else if (shape.shape === "cone") {
          const { radius, height } = shape.parameters;
          const [x, y, z] = shape.coordinates;

          const coneAngle = Math.atan(radius / height);
          const points = [];
          
          const center = transform3DTo2D(x, y, z);
          
          const numPoints = 20;
          for (let i = 0; i <= numPoints; i++) {
            const angle = -coneAngle + (i / numPoints) * (2 * coneAngle);
            const scaledRadius = Math.sqrt(radius * radius + height * height);
            let px, py, pz;

            switch (shape.plane) {
              case "XYConstructionPlane":
                px = x + scaledRadius * Math.cos(angle);
                py = y + scaledRadius * Math.sin(angle);
                pz = z;
                break;
              case "XZConstructionPlane":
                px = x + scaledRadius * Math.cos(angle);
                py = y;
                pz = z + scaledRadius * Math.sin(angle);
                break;
              case "YZConstructionPlane":
                px = x;
                py = y + scaledRadius * Math.cos(angle);
                pz = z + scaledRadius * Math.sin(angle);
                break;
              case "ZXConstructionPlane":
                px = x + scaledRadius * Math.cos(angle);
                py = y;
                pz = z + scaledRadius * Math.sin(angle);
                break;
            }

            points.push(transform3DTo2D(px, py, pz));
          }

          ctx.strokeStyle = COLORS.cone;
          ctx.lineWidth = 2;
          ctx.beginPath();
          
          ctx.moveTo(center.x, center.y);
          
          ctx.lineTo(points[0].x, points[0].y);
          
          for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
          }
          
          ctx.lineTo(center.x, center.y);
          ctx.stroke();
        } else if (shape.shape === "polygon") {
          const { radius, sides } = shape.parameters;
          const [x, y, z] = shape.coordinates;
          const points = [];

          for (let i = 0; i < sides; i++) {
            const angle = (i / sides) * Math.PI * 2;
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
              case "ZXConstructionPlane":
                px = x + radius * Math.cos(angle);
                py = y;
                pz = z + radius * Math.sin(angle);
                break;
            }

            points.push(transform3DTo2D(px, py, pz));
          }

          drawPath(points, COLORS.polygon);
        }
      });
    };

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

export default CoordinatePlane2D;
