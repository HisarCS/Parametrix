import adsk.core
import adsk.fusion
import traceback
import json
import os

# Path to the shared JSON commands directory
COMMANDS_DIR = "[DIR]"

def create_circle(center_x, center_y, radius, root_comp):
    """
    Create a circle in a new sketch on the XY plane of the root component.
    """
    try:
        # Create the center point
        center_point = adsk.core.Point3D.create(center_x, center_y, 0)
        xy_plane = root_comp.xYConstructionPlane
        sketch = root_comp.sketches.add(xy_plane)
        sketch.sketchCurves.sketchCircles.addByCenterRadius(center_point, radius)
        return True
    except Exception as e:
        print(f"Error in create_circle: {str(e)}")
        traceback.print_exc()
        return False

def create_rectangle(center_x, center_y, width, height, root_comp):
    """
    Create a rectangle in a new sketch on the XY plane of the root component.
    """
    try:
        # Calculate corner points
        start_x = center_x - width / 2
        start_y = center_y - height / 2
        end_x = center_x + width / 2
        end_y = center_y + height / 2
        start_point = adsk.core.Point3D.create(start_x, start_y, 0)
        end_point = adsk.core.Point3D.create(end_x, end_y, 0)
        
        xy_plane = root_comp.xYConstructionPlane
        sketch = root_comp.sketches.add(xy_plane)
        sketch.sketchCurves.sketchLines.addTwoPointRectangle(start_point, end_point)
        return True
    except Exception as e:
        print(f"Error in create_rectangle: {str(e)}")
        traceback.print_exc()
        return False

def create_ellipse(center_x, center_y, major_radius, minor_radius, root_comp):
    """
    Create an ellipse in a new sketch on the XY plane of the root component.
    """
    try:
        center_point = adsk.core.Point3D.create(center_x, center_y, 0)
        major_axis_point = adsk.core.Point3D.create(center_x + major_radius, center_y, 0)
        xy_plane = root_comp.xYConstructionPlane
        sketch = root_comp.sketches.add(xy_plane)
        sketch.sketchCurves.sketchEllipses.addByCenter(
            center_point, major_axis_point, minor_radius
        )
        return True
    except Exception as e:
        print(f"Error in create_ellipse: {str(e)}")
        traceback.print_exc()
        return False

def process_command_file(filepath, root_comp):
    """
    Read and process a single JSON file to create a shape.
    """
    try:
        # Load the JSON data
        with open(filepath, 'r') as file:
            command = json.load(file)

        # Determine the shape type
        shape_type = command.get("shape", "").lower()
        if shape_type == "circle":
            return create_circle(
                command.get("center_x", 0.0),
                command.get("center_y", 0.0),
                command.get("radius", 10.0),
                root_comp
            )
        elif shape_type == "rectangle":
            return create_rectangle(
                command.get("center_x", 0.0),
                command.get("center_y", 0.0),
                command.get("width", 10.0),
                command.get("height", 5.0),
                root_comp
            )
        elif shape_type == "ellipse":
            return create_ellipse(
                command.get("center_x", 0.0),
                command.get("center_y", 0.0),
                command.get("major_radius", 10.0),
                command.get("minor_radius", 5.0),
                root_comp
            )
        else:
            print(f"Unknown shape: {shape_type}")
            return False
    except Exception as e:
        print(f"Error in process_command_file: {str(e)}")
        traceback.print_exc()
        return False

def run(context):
    """
    Main entry point for the Fusion 360 script.
    """
    try:
        # Access the Fusion 360 application and active product
        app = adsk.core.Application.get()
        ui = app.userInterface
        design = app.activeProduct

        # Ensure a design is active
        if not design or not isinstance(design, adsk.fusion.Design):
            ui.messageBox("No active Fusion 360 design.", "Error")
            return

        # Access the root component
        root_comp = design.rootComponent

        # Ensure the commands directory exists
        if not os.path.exists(COMMANDS_DIR):
            ui.messageBox(f"Commands directory does not exist: {COMMANDS_DIR}", "Error")
            return

        # List all JSON files in the commands directory
        files = [f for f in os.listdir(COMMANDS_DIR) if f.endswith('.json')]
        if not files:
            ui.messageBox("No JSON files found in the commands directory.", "Info")
            return

        # Process each JSON file
        for file in files:
            filepath = os.path.join(COMMANDS_DIR, file)
            success = process_command_file(filepath, root_comp)
            if success:
                print(f"Successfully processed file: {file}")
                os.remove(filepath)  # Remove the file after successful processing
            else:
                print(f"Failed to process file: {file}")

        # Refresh the viewport
        app.activeViewport.refresh()

    except Exception as e:
        app = adsk.core.Application.get()
        ui = app.userInterface
        ui.messageBox(f"Failed with exception:\n{str(e)}", "Critical Error")
        traceback.print_exc()

# Entry point for Fusion 360 to run the script
if __name__ == '__main__':
    run(None)
