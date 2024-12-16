class CircleCreator:
    def __init__(self, center, radius, plane):
        self.center = center
        self.radius = radius
        self.plane = plane

        app = adsk.core.Application.get()
        self.design = app.activeProduct
        self.root_comp = self.design.rootComponent

    def create_circle(self):
        sketches = self.root_comp.sketches
        sketch = sketches.add(self.plane)

        circles = sketch.sketchCurves.sketchCircles
        return circles.addByCenterRadius(self.center, self.radius)
