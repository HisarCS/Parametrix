module DXFConverter

using JSON

export write_dxf, convert_json_to_dxf, Shape, Circle, Rectangle, Point3D

# Type definitions
abstract type Shape end

struct Point3D
    x::Float64
    y::Float64
    z::Float64
end

struct Circle <: Shape
    center::Point3D
    radius::Float64
end

struct Rectangle <: Shape
    center::Point3D
    width::Float64
    height::Float64
end

# Conversion functions
function shape_from_dict(dict::Dict)
    # Get coordinates
    coords = get(dict, "coordinates", [0.0, 0.0, 0.0])
    coords = length(coords) == 2 ? [coords[1], coords[2], 0.0] : coords
    point = Point3D(coords[1], coords[2], coords[3])
    
    # Create appropriate shape
    shape_type = get(dict, "shape", "")
    params = get(dict, "parameters", Dict())
    
    if shape_type == "circle" && haskey(params, "radius")
        return Circle(point, params["radius"])
    elseif shape_type == "rectangle" && 
           haskey(params, "width") && 
           haskey(params, "height")
        return Rectangle(point, params["width"], params["height"])
    else
        throw(ArgumentError("Invalid or unsupported shape type: $shape_type"))
    end
end

# Write shape to DXF
function write_shape(io::IO, shape::Circle)
    println(io, """
    0
    CIRCLE
    10
    $(shape.center.x)
    20
    $(shape.center.y)
    30
    $(shape.center.z)
    40
    $(shape.radius)
    """)
end

function write_shape(io::IO, shape::Rectangle)
    corners = [
        [shape.center.x - shape.width/2, shape.center.y - shape.height/2],
        [shape.center.x + shape.width/2, shape.center.y - shape.height/2],
        [shape.center.x + shape.width/2, shape.center.y + shape.height/2],
        [shape.center.x - shape.width/2, shape.center.y + shape.height/2]
    ]
    
    for i in 1:4
        next = mod(i, 4) + 1
        println(io, """
        0
        LINE
        10
        $(corners[i][1])
        20
        $(corners[i][2])
        30
        $(shape.center.z)
        11
        $(corners[next][1])
        21
        $(corners[next][2])
        31
        $(shape.center.z)
        """)
    end
end

"""
    write_dxf(file_path::String, shapes::Vector)

Write a collection of shapes to a DXF file.
Shapes can be provided either as Shape objects or as dictionaries.
"""
function write_dxf(file_path::String, shapes::Vector)
    # Convert dictionaries to shapes if necessary
    converted_shapes = map(shape -> 
        shape isa Dict ? shape_from_dict(shape) : shape, 
        shapes)
    
    open(file_path, "w") do io
        # Write DXF header
        println(io, "0\nSECTION\n2\nHEADER\n0\nENDSEC")
        println(io, "0\nSECTION\n2\nENTITIES")
        
        # Write each shape
        for shape in converted_shapes
            write_shape(io, shape)
        end
        
        # Write DXF footer
        println(io, "0\nENDSEC\n0\nEOF")
    end
end

"""
    convert_json_to_dxf(json_file::String, dxf_file::String)

Convert shapes from a JSON file to a DXF file.
The JSON file should contain a "shapes" array of shape objects.
"""
function convert_json_to_dxf(json_file::String, dxf_file::String)
    # Read and validate JSON
    shapes_data = JSON.parsefile(json_file)
    if !haskey(shapes_data, "shapes") || !isa(shapes_data["shapes"], Vector)
        throw(ArgumentError("JSON must contain a 'shapes' array"))
    end
    
    # Convert to DXF
    write_dxf(dxf_file, shapes_data["shapes"])
end

# Utility functions
"""
    create_circle(x::Real, y::Real, radius::Real)

Create a Circle shape at the specified position with given radius.
"""
function create_circle(x::Real, y::Real, radius::Real)
    Circle(Point3D(Float64(x), Float64(y), 0.0), Float64(radius))
end

"""
    create_rectangle(x::Real, y::Real, width::Real, height::Real)

Create a Rectangle shape at the specified position with given dimensions.
"""
function create_rectangle(x::Real, y::Real, width::Real, height::Real)
    Rectangle(Point3D(Float64(x), Float64(y), 0.0), Float64(width), Float64(height))
end

end # module
