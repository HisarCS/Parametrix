import adsk.core
import adsk.fusion
import traceback

class RectangleDrawer:
    def __init__(self, corner1, corner2, plane):
        self.corner1 = corner1
        self.corner2 = corner2
        self.plane = plane

        app = adsk.core.Application.get()
        self.design = app.activeProduct
        self.root_comp = self.design.rootComponent

    def draw_rectangle(self):
        sketches = self.root_comp.sketches
        sketch = sketches.add(self.plane)

        sketch.sketchCurves.sketchLines.addTwoPointRectangle(self.corner1, self.corner2)

 
