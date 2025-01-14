using LinearAlgebra

# Parse ASCII STL file
function parse_stl(filename::String)
    triangles = []
    vertices = Vector{Vector{Float64}}()
    normal = nothing

    open(filename, "r") do file
        for line in eachline(file)
            line = strip(line)
            if startswith(line, "facet normal")
                normal = parse.(Float64, split(line)[3:5])
            elseif startswith(line, "vertex")
                push!(vertices, parse.(Float64, split(line)[2:4]))
                if length(vertices) == 3
                    push!(triangles, (normal, vertices))
                    vertices = Vector{Vector{Float64}}()  # Reset for the next triangle
                end
            end
        end
    end
    return triangles
end

# Normalize geometry to align with the origin
function normalize_geometry(triangles)
    all_vertices = [vertex for (normal, verts) in triangles for vertex in verts]
    min_bounds = minimum.(reduce(hcat, all_vertices))
    max_bounds = maximum.(reduce(hcat, all_vertices))
    center = (min_bounds + max_bounds) / 2.0

    normalized_triangles = [(normal, [(vertex .- center) for vertex in verts]) for (normal, verts) in triangles]
    return normalized_triangles
end

# Intersect triangle with slicing plane
function intersect_triangle_with_plane(triangle, z)
    _, verts = triangle
    v1, v2, v3 = verts
    edges = [(v1, v2), (v2, v3), (v3, v1)]
    intersections = []

    for (p1, p2) in edges
        z1, z2 = p1[3], p2[3]
        if (z1 <= z && z2 > z) || (z1 > z && z2 <= z)
            t = (z - z1) / (z2 - z1)
            intersection = p1 + t * (p2 - p1)
            push!(intersections, intersection[1:2])  # Store only X, Y
        end
    end

    return length(intersections) == 2 ? intersections : nothing
end

# Slice the model into horizontal layers
function slice_model(triangles, layer_height)
    z_min = minimum([minimum(v[3] for v in verts) for (_, verts) in triangles])
    z_max = maximum([maximum(v[3] for v in verts) for (_, verts) in triangles])

    layers = []
    for z in z_min:layer_height:z_max
        layer = []
        for triangle in triangles
            segment = intersect_triangle_with_plane(triangle, z)
            if segment !== nothing
                push!(layer, segment)
            end
        end
        push!(layers, layer)
    end
    return layers
end

# Generate G-code from layers
function generate_gcode(layers, layer_height; extrude_factor=0.1, x_offset=0, y_offset=0)
    gcode = []
    push!(gcode, "G21 ; Set units to millimeters")
    push!(gcode, "G90 ; Absolute positioning")
    push!(gcode, "M82 ; Set extruder to absolute mode")
    push!(gcode, "G28 ; Home all axes")

    z_height = 0.0
    extrude_length = 0.0

    for layer in layers
        z_height += layer_height
        push!(gcode, "G1 Z$(round(z_height, digits=3)) F1200 ; Move to layer height")

        for segment in layer
            start, stop = segment
            start_offset = [start[1] + x_offset, start[2] + y_offset]
            stop_offset = [stop[1] + x_offset, stop[2] + y_offset]
            path_length = norm(stop_offset - start_offset)
            extrusion = extrude_factor * path_length
            extrude_length += extrusion

            # Move to start point
            push!(gcode, "G1 X$(round(start_offset[1], digits=3)) Y$(round(start_offset[2], digits=3)) F1500")
            # Draw line to end point
            push!(gcode, "G1 X$(round(stop_offset[1], digits=3)) Y$(round(stop_offset[2], digits=3)) E$(round(extrude_length, digits=5))")
        end
    end

    push!(gcode, "M104 S0 ; Turn off extruder")
    push!(gcode, "M140 S0 ; Turn off bed")
    push!(gcode, "G28 ; Home all axes")
    push!(gcode, "M84 ; Disable steppers")

    return join(gcode, "\n")
end

# Main function
function main()
    stl_file = "output.stl"  # Replace with your STL file
    gcode_file = "output.gcode"
    layer_height = 0.2

    println("Parsing STL...")
    triangles = parse_stl(stl_file)

    println("Normalizing geometry...")
    triangles = normalize_geometry(triangles)

    println("Slicing model...")
    layers = slice_model(triangles, layer_height)

    println("Generating G-code...")
    gcode = generate_gcode(layers, layer_height)

    println("Saving G-code to file...")
    open(gcode_file, "w") do file
        write(file, gcode)
    end

    println("Done! G-code saved to $gcode_file")
end

main()
