import adsk.core
import adsk.fusion
import traceback

class ExtrudeCreator:
    def __init__(self, profile, distance, operation_type):
        self.profile = profile
        self.distance = distance
        self.operation_type = operation_type

        app = adsk.core.Application.get()
        self.design = app.activeProduct

        self.root_comp = self.design.rootComponent

    def create_extrusion(self):

        extrusions = self.root_comp.features.extrudeFeatures

        extrusion_input = extrusions.createInput(self.profile, adsk.fusion.FeatureOperations.NewBodyFeatureOperation)
        extrusion_input.setDistanceExtent(False, adsk.core.ValueInput.createByReal(self.distance))

        if self.operation_type == 'Cut':
            extrusion_input.operation = adsk.fusion.FeatureOperations.CutFeatureOperation
        elif self.operation_type == 'Join':
            extrusion_input.operation = adsk.fusion.FeatureOperations.JoinFeatureOperation
        elif self.operation_type == 'Intersect':
            extrusion_input.operation = adsk.fusion.FeatureOperations.IntersectFeatureOperation

        extrusions.add(extrusion_input)
