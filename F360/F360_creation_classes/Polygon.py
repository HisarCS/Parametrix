import adsk.core
import adsk.fusion
import traceback
import math

class PolygonDrawer:
    def __init__(self, center_point, num_sides, radius, plane):
        self.center_point = center_point
        self.num_sides = num_sides
        self.radius = radius
        self.plane = plane

        app = adsk.core.Application.get()
        self.design = app.activeProduct
        self.root_comp = self.design.rootComponent

    def draw_polygon(self):
        sketches = self.root_comp.sketches
        sketch = sketches.add(self.plane)

        polygon_points = []
        for i in range(self.num_sides):
            angle = 2 * i * math.pi / self.num_sides
            x = self.center_point.x + self.radius * math.cos(angle)
            y = self.center_point.y + self.radius * math.sin(angle)
            polygon_points.append(adsk.core.Point3D.create(x, y, 0))

        
        for i in range(self.num_sides):
            start_point = polygon_points[i]
            end_point = polygon_points[(i + 1) % self.num_sides]
            sketch.sketchCurves.sketchLines.addByTwoPoints(start_point, end_point)