using JSON

# Utility function to read JSON file
function read_json(file_path::String)
    return JSON.parsefile(file_path)
end

# Calculate triangle vertices using cosine law
function calculate_triangle_vertices(a::Float64, b::Float64, c::Float64, center::Vector{Float64})
    # Calculate angles using cosine law
    cos_A = (b^2 + c^2 - a^2) / (2*b*c)
    angle_A = acos(cos_A)
    
    # Calculate vertices relative to origin
    x1, y1 = 0.0, 0.0  # First vertex at origin
    x2, y2 = c, 0.0    # Second vertex along x-axis
    x3 = b * cos(angle_A)
    y3 = b * sin(angle_A)
    
    # Calculate centroid
    center_x = (x1 + x2 + x3) / 3
    center_y = (y1 + y2 + y3) / 3
    
    # Return vertices translated to the specified center
    [
        [center[1] + (x1 - center_x), center[2] + (y1 - center_y)],
        [center[1] + (x2 - center_x), center[2] + (y2 - center_y)],
        [center[1] + (x3 - center_x), center[2] + (y3 - center_y)]
    ]
end

# Function to write DXF file from shape data
function write_dxf(file_path::String, shapes)
    open(file_path, "w") do io
        println(io, "0")
        println(io, "SECTION")
        println(io, "2")
        println(io, "HEADER")
        println(io, "0")
        println(io, "ENDSEC")
        println(io, "0")
        println(io, "SECTION")
        println(io, "2")
        println(io, "ENTITIES")
        
        for shape in shapes
            if shape["shape"] == "circle"
                center = shape["coordinates"]
                radius = shape["parameters"]["radius"]
                println(io, "0")
                println(io, "CIRCLE")
                println(io, "10")  # X-coordinate
                println(io, center[1])
                println(io, "20")  # Y-coordinate
                println(io, center[2])
                println(io, "30")  # Z-coordinate
                println(io, center[3])
                println(io, "40")  # Radius
                println(io, radius)

            elseif shape["shape"] == "ellipse"
                center = shape["coordinates"]
                major_radius = shape["parameters"]["major_radius"]
                minor_radius = shape["parameters"]["minor_radius"]
                plane = get(shape, "plane", "XYConstructionPlane")
                
                println(io, "0")
                println(io, "ELLIPSE")
                println(io, "10")  # Center X
                println(io, center[1])
                println(io, "20")  # Center Y
                println(io, center[2])
                println(io, "30")  # Center Z
                println(io, center[3])
                
                if plane == "ZXConstructionPlane"
                    println(io, "11")  # Major axis X
                    println(io, 0.0)
                    println(io, "21")  # Major axis Y
                    println(io, major_radius)
                    println(io, "31")  # Major axis Z
                    println(io, 0.0)
                else
                    println(io, "11")  # Major axis X
                    println(io, major_radius)
                    println(io, "21")  # Major axis Y
                    println(io, 0.0)
                    println(io, "31")  # Major axis Z
                    println(io, 0.0)
                end
                
                println(io, "40")  # Ratio of minor to major axis
                println(io, minor_radius/major_radius)
                println(io, "41")  # Start parameter
                println(io, 0.0)
                println(io, "42")  # End parameter
                println(io, 2*π)
                
            elseif shape["shape"] == "rectangle"
                center = shape["coordinates"]
                width = shape["parameters"]["width"]
                height = shape["parameters"]["height"]
                corners = [
                    [center[1] - width/2, center[2] - height/2],
                    [center[1] + width/2, center[2] - height/2],
                    [center[1] + width/2, center[2] + height/2],
                    [center[1] - width/2, center[2] + height/2]
                ]
                for i in 1:4
                    next = mod(i, 4) + 1
                    println(io, "0")
                    println(io, "LINE")
                    println(io, "10")  # Start X
                    println(io, corners[i][1])
                    println(io, "20")  # Start Y
                    println(io, corners[i][2])
                    println(io, "30")  # Start Z
                    println(io, center[3])
                    println(io, "11")  # End X
                    println(io, corners[next][1])
                    println(io, "21")  # End Y
                    println(io, corners[next][2])
                    println(io, "31")  # End Z
                    println(io, center[3])
                end

            elseif shape["shape"] == "triangle"
                center = Float64[Float64(x) for x in shape["coordinates"]]
                a = Float64(shape["parameters"]["side1"])
                b = Float64(shape["parameters"]["side2"])
                c = Float64(shape["parameters"]["side3"])
                
                vertices = calculate_triangle_vertices(a, b, c, center)
                
                println(io, "0")
                println(io, "LWPOLYLINE")
                println(io, "90")
                println(io, "3")
                println(io, "70")
                println(io, "1")
                
                for vertex in vertices
                    println(io, "10")
                    println(io, vertex[1])
                    println(io, "20")
                    println(io, vertex[2])
                end
            end
        end
        
        println(io, "0")
        println(io, "ENDSEC")
        println(io, "0")
        println(io, "EOF")
    end
end

# Main function to process JSON and generate DXF
function convert_json_to_dxf(json_file::String, dxf_file::String)
    shapes_dict = read_json(json_file)
    shapes = shapes_dict["shapes"]  # Extract the shapes list from JSON
    write_dxf(dxf_file, shapes)
end

# Demo function
function demo()
    # Create sample data
    sample_data = Dict(
        "shapes" => [
            Dict(
                "shape" => "triangle",
                "parameters" => Dict(
                    "side1" => 3.0,
                    "side2" => 4.0,
                    "side3" => 5.0
                ),
                "coordinates" => [0.0, 1.0, 1.0]
            ),
            Dict(
                "shape" => "ellipse",
                "parameters" => Dict(
                    "major_radius" => 10.0,
                    "minor_radius" => 5.0
                ),
                "plane" => "XYConstructionPlane",
                "coordinates" => [2.0, 3.0, 1.0]
            ),
            Dict(
                "shape" => "rectangle",
                "coordinates" => [5.0, 5.0, 0.0],
                "parameters" => Dict(
                    "width" => 4.0,
                    "height" => 3.0
                )
            )
        ]
    )
    
    # Write sample data to JSON file
    json_file = "shapes.json"
    open(json_file, "w") do io
        JSON.print(io, sample_data, 4)
    end
    
    dxf_file = "output.dxf"
    println("Converting JSON shapes to DXF...")
    convert_json_to_dxf(json_file, dxf_file)
    println("DXF conversion complete!")
    println("DXF saved as: $dxf_file")
end

demo()
