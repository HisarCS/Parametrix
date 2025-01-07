# JlDocs

## Description

This is the explanation for the Julia Backend code of the project mainly written in **Julia**

# Detailed Documentation for 3D Shape Processing with Julia

## Overview

This document provides an in-depth look at a Julia script designed to process textual commands describing 3D shapes and convert them into STL files suitable for 3D printing. The script makes use of the JSON and LinearAlgebra libraries to facilitate data manipulation and geometric transformations.

## Modules and Dependencies

\```julia
using JSON
using LinearAlgebra
\```

- **JSON**: Handles JSON data structures, enabling the parsing and serialization of structured data.
- **LinearAlgebra**: Used for performing mathematical operations essential for geometric transformations.

## Functionality and Code Explanation

### Function: Parse Command Strings into JSON

\```julia
function parse_input_to_json(input_str::String)
    tokens = split(input_str)
    shape = lowercase(tokens[1])
    params = Dict{String,Any}()

    idx_on = findfirst(x -> lowercase(x) == "on", tokens)
    idx_at = findfirst(x -> lowercase(x) == "at", tokens)
    if idx_on === nothing || idx_at === nothing
        error("Could not parse input. Expected 'on <Plane> at (x,y,z)'.")
    end

    plane_token = tokens[idx_on+1]
    coords_str = tokens[idx_at+1]
    coords_str_clean = replace(coords_str, '(' => "", ')' => "")
    coords_nums = split(coords_str_clean, ",")
    coords = [parse(Float64, c) for c in coords_nums]

    parse_shape_specific_data(tokens, idx_on, params)
    dict_obj = Dict("shape" => shape, "parameters" => params, "plane" => plane_token, "coordinates" => coords)
    return JSON.json(dict_obj)
end
\```

- **Purpose**: Converts command strings into a JSON format that details the shape, its dimensions, positioning plane, and coordinates.
- **Process**:
  - **Tokenization**: Splits the input string into components.
  - **Parameter Parsing**: Extracts parameters specific to the shape before the 'on' keyword.
  - **Error Handling**: Ensures the command includes necessary spatial descriptors.

### Supporting Functions

#### Shape-Specific Data Parsing

```julia
function parse_shape_specific_data(tokens, idx_on, params)
    shape_data = tokens[2 : idx_on - 1]
    # Parsing logic based on shape type (rectangle, ellipse, etc.)
end
```

- Dynamically handles various shapes, extracting relevant dimensions and adding them to the parameters dictionary.

### Geometric and STL File Creation

#### Polygon Generation

```julia
function generate_polygon_local(shape::String, params::Dict{String,Any}; segments=64)
    # Returns an array of (x, y) points representing the shape in the local XY plane.
end
```

- **Purpose**: Creates 2D representations of shapes based on parameters, which are then used for 3D transformations.

#### Plane Transformation

```julia
function plane_transformation(plane::String)
    # Returns a transformation matrix based on the specified plane.
end
```

- **Application**: Adjusts the local XY representation to the specified 3D plane.

#### STL and DXF File Output

```julia
function write_stl(facets, filename::String)
    # Writes the computed 3D points into an STL file format.
end

function write_dxf_2d(points2D, filename::String; closed=true)
    # Writes 2D points into a DXF file.
end
```

- **STL File Creation**: Triangulates the 3D points and formats them into an STL file.
- **DXF File Creation**: Outputs the 2D polygon into a DXF file for CAD applications.
