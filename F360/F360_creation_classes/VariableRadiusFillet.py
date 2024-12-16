class VariableRadiusFillet:
    def __init__(self, start_radius, end_radius, edge_collection, mid_radii, positions):
        self.start_radius = start_radius
        self.end_radius = end_radius
        self.edge_collection = edge_collection
        self.mid_radii = mid_radii
        self.positions = positions

    def create_fillet(self, fillets):
        input = fillets.createInput()
        input.isRollingBallCorner = False

        # Use ValueInput for start_radius and end_radius
        start_radius_input = adsk.core.ValueInput.createByString(self.start_radius)
        end_radius_input = adsk.core.ValueInput.createByString(self.end_radius)

        edge_set_input = input.edgeSetInputs.addVariableRadiusEdgeSet(
            self.edge_collection, start_radius_input, end_radius_input, True
        )
        edge_set_input.continuity = adsk.fusion.SurfaceContinuityTypes.TangentSurfaceContinuityType

        positions = [adsk.core.ValueInput.createByReal(pos) for pos in self.positions]
        radii = [adsk.core.ValueInput.createByString(r) for r in self.mid_radii]

        edge_set_input.setMidRadii(radii, positions)

        return fillets.add(input)
