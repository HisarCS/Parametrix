import adsk.core
import adsk.fusion
import traceback

class ConstantRadiusFillet:
    def __init__(self, radius, edge_collection):
        self.radius = radius
        self.edge_collection = edge_collection

    def create_fillet(self, fillets):
        input = fillets.createInput()
        input.isRollingBallCorner = True

        # Use ValueInput for the radius
        radius_input = adsk.core.ValueInput.createByReal(self.radius)

        edge_set_input = input.edgeSetInputs.addConstantRadiusEdgeSet(self.edge_collection, radius_input, True)
        edge_set_input.continuity = adsk.fusion.SurfaceContinuityTypes.TangentSurfaceContinuityType

        return fillets.add(input)
