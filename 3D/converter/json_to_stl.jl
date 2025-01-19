using JSON

# Utility Functions
function read_json(file_path::String)
    return JSON.parsefile(file_path)
end

# STL Conversion
function generate_circle_stl(center, radius, height, segments)
    triangles = []
    for i in 1:segments
        theta1 = (i - 1) * 2π / segments
        theta2 = i * 2π / segments
        p1 = center
        p2 = center .+ [radius * cos(theta1), radius * sin(theta1), 0.0]
        p3 = center .+ [radius * cos(theta2), radius * sin(theta2), 0.0]
        push!(triangles, (p1, p2, p3))
    end

    # Add extrusion
    for i in 1:segments
        theta1 = (i - 1) * 2π / segments
        theta2 = i * 2π / segments
        base1 = center .+ [radius * cos(theta1), radius * sin(theta1), 0.0]
        base2 = center .+ [radius * cos(theta2), radius * sin(theta2), 0.0]
        top1 = base1 .+ [0.0, 0.0, height]
        top2 = base2 .+ [0.0, 0.0, height]
        push!(triangles, (base1, base2, top1))
        push!(triangles, (top1, base2, top2))
    end
    return triangles
end

function generate_rectangle_stl(center, width, height, depth)
    corners = [
        center .+ [-width / 2, -height / 2, 0.0],
        center .+ [width / 2, -height / 2, 0.0],
        center .+ [width / 2, height / 2, 0.0],
        center .+ [-width / 2, height / 2, 0.0]
    ]
    top_corners = [c .+ [0.0, 0.0, depth] for c in corners]
    triangles = []

    # Bottom face
    push!(triangles, (corners[1], corners[2], corners[3]))
    push!(triangles, (corners[1], corners[3], corners[4]))

    # Top face
    push!(triangles, (top_corners[1], top_corners[3], top_corners[2]))
    push!(triangles, (top_corners[1], top_corners[4], top_corners[3]))

    # Sides
    for i in 1:4
        next = mod(i, 4) + 1
        push!(triangles, (corners[i], corners[next], top_corners[i]))
        push!(triangles, (top_corners[i], corners[next], top_corners[next]))
    end

    return triangles
end

function write_stl(file_path::String, triangles)
    open(file_path, "w") do io
        println(io, "solid model")
        for (p1, p2, p3) in triangles
            normal = normalize(cross(p2 - p1, p3 - p1))
            println(io, "facet normal $(normal[1]) $(normal[2]) $(normal[3])")
            println(io, "  outer loop")
            println(io, "    vertex $(p1[1]) $(p1[2]) $(p1[3])")
            println(io, "    vertex $(p2[1]) $(p2[2]) $(p2[3])")
            println(io, "    vertex $(p3[1]) $(p3[2]) $(p3[3])")
            println(io, "  endloop")
            println(io, "endfacet")
        end
        println(io, "endsolid model")
    end
end

# DXF Conversion
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
                println(io, "10")
                println(io, center[1])
                println(io, "20")
                println(io, center[2])
                println(io, "30")
                println(io, center[3])
                println(io, "40")
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
                    println(io, "10")
                    println(io, corners[i][1])
                    println(io, "20")
                    println(io, corners[i][2])
                    println(io, "30")
                    println(io, center[3])
                    println(io, "11")
                    println(io, corners[next][1])
                    println(io, "21")
                    println(io, corners[next][2])
                    println(io, "31")
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

# Main Function
function convert_json_to_geometry(json_file::String, stl_file::String, dxf_file::String)
    shapes_dict = read_json(json_file)
    shapes = shapes_dict["shapes"]  # Access the list of shapes
    all_triangles = []

    for shape in shapes
        if shape["shape"] == "circle"
            radius = shape["parameters"]["radius"]
            height = shape["extrusion_amount"]
            append!(all_triangles, generate_circle_stl(shape["coordinates"], radius, height, 32))
        elseif shape["shape"] == "rectangle"
            width = shape["parameters"]["width"]
            height = shape["parameters"]["height"]
            depth = shape["extrusion_amount"]
            append!(all_triangles, generate_rectangle_stl(shape["coordinates"], width, height, depth))
        end
    end

    write_stl(stl_file, all_triangles)
    write_dxf(dxf_file, shapes)
end

# Demo Function
function demo()
    json_file = "shapes.json"
    stl_file = "output.stl"
    dxf_file = "output.dxf"
    println("Converting JSON shapes to STL and DXF...")
    convert_json_to_geometry(json_file, stl_file, dxf_file)
    println("Conversion complete!")
    println("STL saved as: $stl_file")
    println("DXF saved as: $dxf_file")
end

demo()
