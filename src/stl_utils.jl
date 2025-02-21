using JSON
using LinearAlgebra

# Utility function to read JSON file
function read_json(file_path::String)
    return JSON.parsefile(file_path)
end

# Write STL file
function write_stl(file_path::String, triangles)
    open(file_path, "w") do io
        println(io, "solid model")
        for (p1, p2, p3) in triangles
            # Calculate normal vector
            v1 = p2 .- p1
            v2 = p3 .- p1
            normal = normalize(cross(v1, v2))
            
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
        [center[1] + (x1 - center_x), center[2] + (y1 - center_y), center[3]],
        [center[1] + (x2 - center_x), center[2] + (y2 - center_y), center[3]],
        [center[1] + (x3 - center_x), center[2] + (y3 - center_y), center[3]]
    ]
end

# Generate STL for circle
function generate_circle_stl(center, radius, height, segments=32)
    triangles = []
    
    # Bottom face
    for i in 1:segments
        theta1 = (i - 1) * 2π / segments
        theta2 = i * 2π / segments
        p1 = center
        p2 = center .+ [radius * cos(theta1), radius * sin(theta1), 0.0]
        p3 = center .+ [radius * cos(theta2), radius * sin(theta2), 0.0]
        push!(triangles, (p1, p2, p3))
    end
    
    # Top face
    top_center = center .+ [0.0, 0.0, height]
    for i in 1:segments
        theta1 = (i - 1) * 2π / segments
        theta2 = i * 2π / segments
        p1 = top_center
        p2 = top_center .+ [radius * cos(theta1), radius * sin(theta1), 0.0]
        p3 = top_center .+ [radius * cos(theta2), radius * sin(theta2), 0.0]
        push!(triangles, (p1, p3, p2))  # Reverse order for correct normal
    end
    
    # Side faces
    for i in 1:segments
        theta1 = (i - 1) * 2π / segments
        theta2 = i * 2π / segments
        
        bottom1 = center .+ [radius * cos(theta1), radius * sin(theta1), 0.0]
        bottom2 = center .+ [radius * cos(theta2), radius * sin(theta2), 0.0]
        top1 = bottom1 .+ [0.0, 0.0, height]
        top2 = bottom2 .+ [0.0, 0.0, height]
        
        push!(triangles, (bottom1, bottom2, top1))
        push!(triangles, (top1, bottom2, top2))
    end
    
    return triangles
end

# Generate STL for rectangle
function generate_rectangle_stl(center, width, height, depth)
    corners = [
        center .+ [-width/2, -height/2, 0.0],
        center .+ [width/2, -height/2, 0.0],
        center .+ [width/2, height/2, 0.0],
        center .+ [-width/2, height/2, 0.0]
    ]
    top_corners = [c .+ [0.0, 0.0, depth] for c in corners]
    triangles = []
    
    # Bottom face
    push!(triangles, (corners[1], corners[2], corners[3]))
    push!(triangles, (corners[1], corners[3], corners[4]))
    
    # Top face
    push!(triangles, (top_corners[1], top_corners[3], top_corners[2]))
    push!(triangles, (top_corners[1], top_corners[4], top_corners[3]))
    
    # Side faces
    for i in 1:4
        next = mod(i, 4) + 1
        push!(triangles, (corners[i], corners[next], top_corners[i]))
        push!(triangles, (top_corners[i], corners[next], top_corners[next]))
    end
    
    return triangles
end

# Generate STL for triangle
function generate_triangle_stl(vertices, height)
    base_vertices = vertices
    top_vertices = [v .+ [0.0, 0.0, height] for v in base_vertices]
    triangles = []
    
    # Base triangle
    push!(triangles, (base_vertices[1], base_vertices[2], base_vertices[3]))
    
    # Top triangle
    push!(triangles, (top_vertices[1], top_vertices[3], top_vertices[2]))
    
    # Side faces
    for i in 1:3
        next = mod(i, 3) + 1
        push!(triangles, (base_vertices[i], base_vertices[next], top_vertices[i]))
        push!(triangles, (top_vertices[i], base_vertices[next], top_vertices[next]))
    end
    
    return triangles
end

# Main conversion function
function convert_shapes_to_stl(shapes, output_file::String)
    all_triangles = []
    
    for shape in shapes
        if shape["shape"] == "circle"
            radius = Float64(shape["parameters"]["radius"])
            height = get(shape, "extrusion_amount", 0.0)
            if height > 0
                center = Float64[Float64(x) for x in shape["coordinates"]]
                append!(all_triangles, generate_circle_stl(center, radius, height))
            end
            
        elseif shape["shape"] == "rectangle"
            width = Float64(shape["parameters"]["width"])
            height = Float64(shape["parameters"]["height"])
            depth = get(shape, "extrusion_amount", 0.0)
            if depth > 0
                center = Float64[Float64(x) for x in shape["coordinates"]]
                append!(all_triangles, generate_rectangle_stl(center, width, height, depth))
            end
            
        elseif shape["shape"] == "triangle"
            center = Float64[Float64(x) for x in shape["coordinates"]]
            a = Float64(shape["parameters"]["side1"])
            b = Float64(shape["parameters"]["side2"])
            c = Float64(shape["parameters"]["side3"])
            depth = get(shape, "extrusion_amount", 0.0)
            
            if depth > 0
                vertices = calculate_triangle_vertices(a, b, c, center)
                append!(all_triangles, generate_triangle_stl(vertices, depth))
            end
        end
    end
    
    write_stl(output_file, all_triangles)
end

# Example usage
function main()
    sample_data = Dict(
        "shapes" => [
            Dict(
                "shape" => "triangle",
                "parameters" => Dict(
                    "side1" => 3.0,
                    "side2" => 4.0,
                    "side3" => 5.0
                ),
                "coordinates" => [0.0, 1.0, 1.0],
                "extrusion_amount" => 2.0
            ),
            Dict(
                "shape" => "circle",
                "coordinates" => [5.0, 5.0, 0.0],
                "parameters" => Dict("radius" => 2.0),
                "extrusion_amount" => 3.0
            ),
            Dict(
                "shape" => "rectangle",
                "coordinates" => [-2.0, -2.0, 0.0],
                "parameters" => Dict(
                    "width" => 4.0,
                    "height" => 3.0
                ),
                "extrusion_amount" => 2.5
            )
        ]
    )
    
    # Save sample data
    json_file = "shapes.json"
    open(json_file, "w") do io
        JSON.print(io, sample_data, 4)
    end
    
    # Convert to STL
    println("Converting shapes to STL...")
    convert_shapes_to_stl(sample_data["shapes"], "output.stl")
    println("STL file generated successfully!")
end


    main()
