using JSON

# Utility function to read JSON file
function read_json(file_path::String)
    return JSON.parsefile(file_path)
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
            
            elseif shape["shape"] == "rectangle"
                center = shape["coordinates"]
                width = shape["parameters"]["width"]
                height = shape["parameters"]["height"]
                corners = [
                    [center[1] - width / 2, center[2] - height / 2],
                    [center[1] + width / 2, center[2] - height / 2],
                    [center[1] + width / 2, center[2] + height / 2],
                    [center[1] - width / 2, center[2] + height / 2]
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
    json_file = "shapes.json"
    dxf_file = "output.dxf"
    println("Converting JSON shapes to DXF...")
    convert_json_to_dxf(json_file, dxf_file)
    println("DXF conversion complete!")
    println("DXF saved as: $dxf_file")
end

demo()
