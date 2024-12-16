import adsk.core, adsk.fusion, adsk.cam, traceback

class OffsetCreator:
    def __init__(self, app):
        self.app = app
        self.ui = app.userInterface
        self.design = app.activeProduct
        self.rootComp = self.design.rootComponent

    def create_offset(self, sketch, entities, offset_distance, direction_point):
        entity_collection = adsk.core.ObjectCollection.create()
        for entity in entities:
            entity_collection.add(entity)
        direction_point = adsk.core.Point3D.create(direction_point[0], direction_point[1], direction_point[2])
        if sketch.offset(entity_collection, direction_point, offset_distance):
            self.ui.messageBox('Offset created successfully!')
        else:
            self.ui.messageBox('Failed to create offset.')
