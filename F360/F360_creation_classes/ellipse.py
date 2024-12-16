import adsk.core, adsk.fusion, adsk.cam, traceback

class EllipseDrawer:
    def __init__(self, app):
        self.app = app
        self.ui = app.userInterface
        self.design = app.activeProduct
        self.rootComp = self.design.rootComponent

    def draw_ellipse(self, plane_name, center_x, center_y, major_axis_length, minor_axis_length):
        if plane_name.lower() == 'xy':
            plane = self.rootComp.xYConstructionPlane
        elif plane_name.lower() == 'xz':
            plane = self.rootComp.xZConstructionPlane
        elif plane_name.lower() == 'yz':
            plane = self.rootComp.yZConstructionPlane
        else:
            self.ui.messageBox(f"Plane {plane_name} not recognized. Please use 'XY', 'XZ', or 'YZ'.")
            return
        
        sketches = self.rootComp.sketches
        sketch = sketches.add(plane)
        center = adsk.core.Point3D.create(center_x, center_y, 0)
        major_axis_point = adsk.core.Point3D.create(center_x + major_axis_length / 2, center_y, 0)
        
        # Calculate a point on the minor axis
        if plane_name.lower() == 'xy' or plane_name.lower() == 'xz':
            minor_axis_point = adsk.core.Point3D.create(center_x, center_y + minor_axis_length / 2, 0)
        else: # 'YZ' plane
            minor_axis_point = adsk.core.Point3D.create(0, center_y + minor_axis_length / 2, center_x)
        
        sketch.sketchCurves.sketchEllipses.add(center, major_axis_point, minor_axis_point)
        self.ui.messageBox(f'Ellipse drawn successfully on the {plane_name} plane!')
