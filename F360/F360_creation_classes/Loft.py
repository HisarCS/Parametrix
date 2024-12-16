import adsk.core, adsk.fusion, adsk.cam, traceback

class Lofter:
    def __init__(self, app):
        self.app = app
        self.ui = app.userInterface
        self.design = app.activeProduct
        self.rootComp = self.design.rootComponent
        self.profiles = []
        self.planes = []

    def add_profile(self, plane, sketch_function):
        sketches = self.rootComp.sketches
        sketch = sketches.add(plane)
        sketch_function(sketch)
        self.profiles.append(sketch.profiles[0])

    def create_loft(self):
        loftFeats = self.rootComp.features.loftFeatures
        loftInput = loftFeats.createInput(adsk.fusion.FeatureOperations.NewBodyFeatureOperation)
        loftSections = loftInput.loftSections
        for profile in self.profiles:
            loftSections.add(profile)
        loftFeats.add(loftInput)
