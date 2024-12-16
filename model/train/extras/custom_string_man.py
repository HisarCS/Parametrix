import json
import re


def format_to_jsonable(input_string):
    try:
        structured_data = {}
        parameters = {}

        shape_match = re.search(r'"shape":\s*"([^"]+)"', input_string)
        if shape_match:
            structured_data['shape'] = shape_match.group(1).strip()


        param_matches = re.findall(r'"(\w+)":\s*([\d\.]+)', input_string)
        for param_key, param_value in param_matches:
            if param_key not in ("shape", "plane", "coordinates"): 
                try:
                    param_value = int(param_value)
                except ValueError:
                    pass
                parameters[param_key] = param_value

        structured_data["parameters"] = parameters


        plane_match = re.search(r'"plane":\s*"([^"]+)"', input_string)
        if plane_match:
            structured_data['plane'] = plane_match.group(1).strip()


        coordinates_match = re.search(r'"coordinates":\s*(\[[^\]]+\])', input_string)
        if coordinates_match:
            coordinates = json.loads(coordinates_match.group(1).strip())
            structured_data["coordinates"] = coordinates

        return structured_data

    except Exception as e:
        print(f"Error in formatting: {e}")
        return None


def test_format_to_jsonable():
    print("Running test cases...\n")
    for input_string in inputs:
        print(f"Input: {input_string}")
        formatted_output = format_to_jsonable(input_string)
        if formatted_output:
            print(f"Formatted JSON:\n{json.dumps(formatted_output, indent=4)}\n")
        else:
            print("Failed to format the input.\n")
