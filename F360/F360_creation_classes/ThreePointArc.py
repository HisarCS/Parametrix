class ThreePointArcCreator:
    def __init__(self, construction_plane):

        self.app = adsk.core.Application.get()
        self.ui = self.app.userInterface

        
        self.design = self.app.activeProduct
        self.root_comp = self.design.rootComponent

       
        sketches = self.root_comp.sketches
        self.sketch = sketches.add(construction_plane)

    def create_arc(self, point1, point2, point3):
        try:
                        arc = self.sketch.sketchCurves.sketchArcs.addByThreePoints(point1, point2, point3)
        except Exception as e:
            if self.ui:
                self.ui.messageBox('Failed:\n{}'.format(traceback.format_exc()))