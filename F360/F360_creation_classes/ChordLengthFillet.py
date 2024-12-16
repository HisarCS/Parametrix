class ChordLengthFillet:
    def __init__(self, chord_length, edge_collection):
        self.chord_length = chord_length
        self.edge_collection = edge_collection

    def create_fillet(self, fillets):
        input = fillets.createInput()
        input.isRollingBallCorner = True

        # Use ValueInput for chord_length
        chord_length_input = adsk.core.ValueInput.createByReal(self.chord_length)

        edge_set_input = input.edgeSetInputs.addChordLengthEdgeSet(self.edge_collection, chord_length_input, True)
        edge_set_input.continuity = adsk.fusion.SurfaceContinuityTypes.TangentSurfaceContinuityType

        return fillets.add(input)
