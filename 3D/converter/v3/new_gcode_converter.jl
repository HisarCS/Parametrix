# STL to G-code Generator with Diagonal Grid Infill
using LinearAlgebra

# STL Parsing
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
                    push!(triangles, (normal, copy(vertices)))
                    empty!(vertices)
                end
            end
        end
    end
    return triangles
end

# Normalize Model
function normalize_model(triangles)
    all_vertices = vcat([[v for v in verts] for (_, verts) in triangles]...)
    min_coords = minimum.(zip(all_vertices...))
    max_coords = maximum.(zip(all_vertices...))
    center = (min_coords .+ max_coords) ./ 2

    normalized = [(normal, [v .- center for v in verts]) for (normal, verts) in triangles]
    return normalized
end

# Slice Model into Layers
function slice_model(triangles, layer_height)
    all_vertices = vcat([[v for v in verts] for (_, verts) in triangles]...)
    z_min = minimum(v[3] for v in all_vertices)
    z_max = maximum(v[3] for v in all_vertices)

    layers = []
    current_z = z_min

    while current_z <= z_max
        layer_segments = []

        for (_, vertices) in triangles
            v1, v2, v3 = vertices
            z_vals = [v[3] for v in vertices]
            min_z, max_z = extrema(z_vals)

            if min_z <= current_z <= max_z
                intersections = []
                edges = [(v1, v2), (v2, v3), (v3, v1)]

                for (p1, p2) in edges
                    if (p1[3] <= current_z && p2[3] >= current_z) ||
                       (p1[3] >= current_z && p2[3] <= current_z)
                        t = (current_z - p1[3]) / (p2[3] - p1[3])
                        point = p1 + t * (p2 - p1)
                        push!(intersections, point[1:2])
                    end
                end

                if length(intersections) == 2
                    push!(layer_segments, intersections)
                end
            end
        end

        push!(layers, layer_segments)
        current_z += layer_height
    end

    return layers
end

# Generate Diagonal Grid Infill
function generate_diagonal_grid_infill(layer_segments, density=0.6)
    if isempty(layer_segments)
        return []
    end

    all_points = vcat(layer_segments...)
    x_coords = [p[1] for p in all_points]
    y_coords = [p[2] for p in all_points]

    min_x, max_x = extrema(x_coords)
    min_y, max_y = extrema(y_coords)

    diagonal = sqrt((max_x - min_x)^2 + (max_y - min_y)^2)
    grid_spacing = diagonal * (1 - density) * 0.3  # Reduced offset for finer grid

    rot_45 = [cos(pi/4) -sin(pi/4); sin(pi/4) cos(pi/4)]
    rot_neg_45 = [cos(-pi/4) -sin(-pi/4); sin(-pi/4) cos(-pi/4)]

    infill_lines = []

    current_offset = min_x - diagonal
    while current_offset <= max_x + diagonal
        line_start = [current_offset, min_y - diagonal]
        line_end = [current_offset + diagonal, max_y + diagonal]
        rotated_start = rot_45 * line_start
        rotated_end = rot_45 * line_end
        append_grid_lines!(infill_lines, layer_segments, rotated_start, rotated_end)
        current_offset += grid_spacing
    end

    current_offset = min_x - diagonal
    while current_offset <= max_x + diagonal
        line_start = [current_offset, min_y - diagonal]
        line_end = [current_offset + diagonal, max_y + diagonal]
        rotated_start = rot_neg_45 * line_start
        rotated_end = rot_neg_45 * line_end
        append_grid_lines!(infill_lines, layer_segments, rotated_start, rotated_end)
        current_offset += grid_spacing
    end

    return infill_lines
end

function append_grid_lines!(infill_lines, layer_segments, line_start, line_end)
    intersections = []

    for segment in layer_segments
        p1, p2 = segment

        v1 = line_end - line_start
        v2 = p2 - p1
        cross_prod = v1[1] * v2[2] - v1[2] * v2[1]

        if abs(cross_prod) > 1e-10
            t1 = ((p1[1] - line_start[1]) * v2[2] - (p1[2] - line_start[2]) * v2[1]) / cross_prod
            t2 = ((p1[1] - line_start[1]) * v1[2] - (p1[2] - line_start[2]) * v1[1]) / cross_prod

            if 0 <= t1 <= 1 && 0 <= t2 <= 1
                intersection = line_start + t1 * v1
                push!(intersections, intersection)
            end
        end
    end

    if !isempty(intersections)
        sort!(intersections, by=x -> x[1] + x[2])
        for i in 1:2:length(intersections) - 1
            push!(infill_lines, (intersections[i], intersections[i + 1]))
        end
    end
end

# Generate G-code
function generate_gcode(layers, layer_height; infill_density=0.6, print_speed=60, travel_speed=120, extrusion_width=0.4, filament_diameter=1.75, temperature=200)
    gcode = String[]

    push!(gcode, """
    M104 S$temperature ; Set hotend temperature
    M140 S60 ; Set bed temperature
    G28 ; Home all axes
    G90 ; Absolute positioning
    M82 ; Absolute extrusion
    G21 ; Set units to millimeters
    M109 S$temperature ; Wait for hotend temperature
    M190 S60 ; Wait for bed temperature
    """)

    z = layer_height
    e = 0.0
    area_ratio = (extrusion_width * layer_height) / (π * (filament_diameter/2)^2)

    for (layer_idx, layer) in enumerate(layers)
        push!(gcode, "G1 Z$(round(z, digits=3)) F600")

        for segment in layer
            start, end_point = segment
            length = norm(end_point - start)
            extrusion = length * area_ratio
            e += extrusion

            push!(gcode, "G1 X$(round(start[1], digits=3)) Y$(round(start[2], digits=3)) F$(travel_speed * 60)")
            push!(gcode, "G1 X$(round(end_point[1], digits=3)) Y$(round(end_point[2], digits=3)) E$(round(e, digits=5)) F$(print_speed * 60)")
        end

        infill = generate_diagonal_grid_infill(layer, infill_density)

        for (start, end_point) in infill
            length = norm(end_point - start)
            extrusion = length * area_ratio * 0.95
            e += extrusion

            push!(gcode, "G1 X$(round(start[1], digits=3)) Y$(round(start[2], digits=3)) F$(travel_speed * 60)")
            push!(gcode, "G1 X$(round(end_point[1], digits=3)) Y$(round(end_point[2], digits=3)) E$(round(e, digits=5)) F$(print_speed * 60)")
        end

        z += layer_height
    end

    push!(gcode, """
    M104 S0 ; Turn off hotend
    M140 S0 ; Turn off bed
    G28 X0 Y0 ; Home X/Y
    M84 ; Disable motors
    """)

    return join(gcode, "\n")
end

# Main Function
function main()
    input_file = "output.stl"
    output_file = "output.gcode"

    settings = Dict(
        "layer_height" => 0.2,
        "infill_density" => 0.6,
        "print_speed" => 60,
        "travel_speed" => 120,
        "extrusion_width" => 0.4,
        "filament_diameter" => 1.75,
        "temperature" => 200
    )

    println("Starting STL to G-code conversion...")

    println("Loading STL file...")
    triangles = parse_stl(input_file)

    println("Normalizing model...")
    normalized = normalize_model(triangles)

    println("Slicing model...")
    layers = slice_model(normalized, settings["layer_height"])

    println("Generating G-code...")
    gcode = generate_gcode(
        layers,
        settings["layer_height"];
        infill_density=settings["infill_density"],
        print_speed=settings["print_speed"],
        travel_speed=settings["travel_speed"],
        extrusion_width=settings["extrusion_width"],
        filament_diameter=settings["filament_diameter"],
        temperature=settings["temperature"]
    )

    println("Writing G-code to file...")
    write(output_file, gcode)

    println("Done! G-code saved to $output_file")
end

main()
