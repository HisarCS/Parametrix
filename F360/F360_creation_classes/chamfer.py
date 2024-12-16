import adsk.core, adsk.fusion, adsk.cam, traceback

class ChamferCreator:
    def __init__(self, app):
        self.app = app
        self.ui = app.userInterface
        self.design = app.activeProduct
    
    def create_chamfer(self, edges, distance):
        rootComp = self.design.rootComponent
        chamfers = rootComp.features.chamferFeatures
        chamferInput = chamfers.createInput(adsk.core.ObjectCollection.create(), False)
        for edge in edges:
            chamferInput.edges.add(edge)
        chamferInput.setToEqualDistance(adsk.core.ValueInput.createByReal(distance))
        chamfer = chamfers.add(chamferInput)
        if chamfer:
            self.ui.messageBox('Chamfer created successfully!')
        else:
            self.ui.messageBox('Failed to create chamfer.')
