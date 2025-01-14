using LinearAlgebra

# STL parsing
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

# Center and normalize the model
function normalize_model(triangles)
    # Extract all vertices
    all_vertices = vcat([[v for v in verts] for (_, verts) in triangles]...)
    
    # Find center and bounds
    min_coords = minimum.(zip(all_vertices...))
    max_coords = maximum.(zip(all_vertices...))
    center = (min_coords .+ max_coords) ./ 2

    # Center model and scale if needed
    normalized = [(normal, [v .- center for v in verts]) for (normal, verts) in triangles]
    return normalized
end

# Slice model into layers
function slice_model(triangles, layer_height)
    # Find model bounds
    all_vertices = vcat([[v for v in verts] for (_, verts) in triangles]...)
    z_min = minimum(v[3] for v in all_vertices)
    z_max = maximum(v[3] for v in all_vertices)
    
    layers = []
    current_z = z_min
    
    while current_z <= z_max
        layer_segments = []
        
        for (_, vertices) in triangles
            v1, v2, v3 = vertices
            
            # Check if triangle intersects this layer
            z_vals = [v[3] for v in vertices]
            min_z, max_z = extrema(z_vals)
            
            if min_z <= current_z <= max_z
                # Find intersections with layer plane
                intersections = []
                edges = [(v1, v2), (v2, v3), (v3, v1)]
                
                for (p1, p2) in edges
                    if (p1[3] <= current_z && p2[3] >= current_z) ||
                       (p1[3] >= current_z && p2[3] <= current_z)
                        t = (current_z - p1[3]) / (p2[3] - p1[3])
                        point = p1 + t * (p2 - p1)
                        push!(intersections, point[1:2])  # Only store X,Y coordinates
                    end
                end
                
                # Add line segment if we found two intersections
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

# Generate infill pattern for a layer
function generate_infill(layer_segments, density=0.2, angle=45.0)
    if isempty(layer_segments)
        return []
    end
    
    # Find layer bounds
    all_points = vcat(layer_segments...)
    x_coords = [p[1] for p in all_points]
    y_coords = [p[2] for p in all_points]
    
    min_x, max_x = extrema(x_coords)
    min_y, max_y = extrema(y_coords)
    
    # Calculate spacing based on density
    diagonal = sqrt((max_x - min_x)^2 + (max_y - min_y)^2)
    spacing = diagonal * (1 - density)
    
    # Generate rotated lines
    θ = deg2rad(angle)
    rot = [cos(θ) -sin(θ); sin(θ) cos(θ)]
    
    infill_lines = []
    
    # Generate parallel lines
    d = min_x
    while d <= max_x
        line_start = rot * [d, min_y]
        line_end = rot * [d, max_y]
        
        # Find intersections with layer segments
        intersections = []
        for segment in layer_segments
            p1, p2 = segment
            
            # Line-line intersection
            v1 = line_end - line_start
            v2 = p2 - p1
            cross_prod = v1[1]*v2[2] - v1[2]*v2[1]
            
            if abs(cross_prod) > 1e-10
                t1 = ((p1[1] - line_start[1])*v2[2] - (p1[2] - line_start[2])*v2[1]) / cross_prod
                t2 = ((p1[1] - line_start[1])*v1[2] - (p1[2] - line_start[2])*v1[1]) / cross_prod
                
                if 0 <= t1 <= 1 && 0 <= t2 <= 1
                    intersection = line_start + t1*v1
                    push!(intersections, intersection)
                end
            end
        end
        
        # Sort intersections and create line segments
        if !isempty(intersections)
            sort!(intersections, by=x->x[2])
            for i in 1:2:length(intersections)-1
                push!(infill_lines, (intersections[i], intersections[i+1]))
            end
        end
        
        d += spacing
    end
    
    return infill_lines
end

# Generate G-code
function generate_gcode(layers, layer_height; 
                       infill_density=0.2,
                       print_speed=60,
                       travel_speed=120,
                       extrusion_width=0.4,
                       filament_diameter=1.75,
                       temperature=200)
    
    gcode = String[]
    
    # Start G-code
    push!(gcode, """
    M104 S$(temperature) ; Set hotend temperature
    M140 S60 ; Set bed temperature
    G28 ; Home all axes
    G90 ; Absolute positioning
    M82 ; Absolute extrusion
    G21 ; Set units to millimeters
    M109 S$(temperature) ; Wait for hotend temperature
    M190 S60 ; Wait for bed temperature
    """)
    
    z = layer_height
    e = 0.0  # Extrusion amount
    
    # Calculate extrusion per mm based on filament and extrusion width
    area_ratio = (extrusion_width * layer_height) / (π * (filament_diameter/2)^2)
    
    for (layer_idx, layer) in enumerate(layers)
        # Move to layer height
        push!(gcode, "G1 Z$(round(z, digits=3)) F600")
        
        # Print perimeter
        for segment in layer
            start, end_point = segment
            
            # Calculate extrusion
            length = norm(end_point - start)
            extrusion = length * area_ratio
            e += extrusion
            
            # Generate moves
            push!(gcode, "G1 X$(round(start[1], digits=3)) Y$(round(start[2], digits=3)) F$(travel_speed*60)")
            push!(gcode, "G1 X$(round(end_point[1], digits=3)) Y$(round(end_point[2], digits=3)) E$(round(e, digits=5)) F$(print_speed*60)")
        end
        
        # Generate and print infill
        angle = layer_idx % 2 == 0 ? 45.0 : 135.0
        infill = generate_infill(layer, infill_density, angle)
        
        for (start, end_point) in infill
            length = norm(end_point - start)
            extrusion = length * area_ratio * 0.95  # Slightly less extrusion for infill
            e += extrusion
            
            push!(gcode, "G1 X$(round(start[1], digits=3)) Y$(round(start[2], digits=3)) F$(travel_speed*60)")
            push!(gcode, "G1 X$(round(end_point[1], digits=3)) Y$(round(end_point[2], digits=3)) E$(round(e, digits=5)) F$(print_speed*60)")
        end
        
        z += layer_height
    end
    
    # End G-code
    push!(gcode, """
    M104 S0 ; Turn off hotend
    M140 S0 ; Turn off bed
    G28 X0 Y0 ; Home X/Y
    M84 ; Disable motors
    """)
    
    return join(gcode, "\n")
end

# Modify the main function
function main()
    # Configuration
    input_file = "output.stl"
    output_file = "output.gcode"
    
    # Print settings
    settings = Dict(
        "layer_height" => 0.2,  # Original layer height
        "layer_scale_factor" => 0.5,  # Make layers 50% closer
        "infill_density" => 0.2,
        "print_speed" => 60,  # mm/s
        "travel_speed" => 120,  # mm/s
        "extrusion_width" => 0.4,
        "filament_diameter" => 1.75,
        "temperature" => 200
    )
    
    println("Starting STL to G-code conversion...")
    
    # Load and process STL
    println("Loading STL file...")
    triangles = parse_stl(input_file)
    
    println("Normalizing model...")
    normalized = normalize_model(triangles)
    
    # Calculate scaled layer height
    scaled_layer_height = settings["layer_height"] * settings["layer_scale_factor"]
    println("Adjusted layer height: $scaled_layer_height")
    
    println("Slicing model...")
    layers = slice_model(normalized, scaled_layer_height)
    
    println("Generating G-code...")
    gcode = generate_gcode(
        layers,
        scaled_layer_height;
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
    println("Layer count: $(length(layers))")
end

main()
