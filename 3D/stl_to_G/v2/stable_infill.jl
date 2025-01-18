using LinearAlgebra
using Statistics
using Printf

# Core geometry types
mutable struct Vector3D
    x::Float64
    y::Float64
    z::Float64
end

mutable struct Triangle
    v1::Vector3D
    v2::Vector3D
    v3::Vector3D
    normal::Vector3D
end

mutable struct Face
    vertices::Vector{Vector3D}
    normal::Vector3D
    edges::Vector{Edge}
end



mutable struct Edge
    start::Vector3D
    endp::Vector3D
    face::Union{Nothing, Face}
    twin::Union{Nothing, Edge}
end



mutable struct Vertex
    pos::Vector3D
    edges::Vector{Edge}
end

mutable struct BoundingBox
    min_x::Float64
    max_x::Float64
    min_y::Float64
    max_y::Float64
    min_z::Float64
    max_z::Float64
end


mutable struct Mesh
    vertices::Vector{Vector3D}
    faces::Vector{Face}
    edges::Vector{Edge}
    bounds::BoundingBox
end


mutable struct Layer
    z::Float64
    perimeters::Vector{Vector{Vector3D}}
    infill_paths::Vector{Vector{Vector3D}}
    support_paths::Vector{Vector{Vector3D}}
    bridging_paths::Vector{Vector{Vector3D}}
end

mutable struct PrintConfig
    layer_height::Float64
    initial_layer_height::Float64
    nozzle_diameter::Float64
    filament_diameter::Float64
    extrusion_multiplier::Float64
    retraction_distance::Float64
    retraction_speed::Float64
    retraction_min_travel::Float64
    print_speed::Float64
    initial_layer_speed::Float64
    travel_speed::Float64
    perimeter_speed::Float64
    infill_speed::Float64
    support_speed::Float64
    bridge_speed::Float64
    bridge_flow_ratio::Float64
    infill_density::Float64
    infill_pattern::Symbol  # :grid, :honeycomb, :triangles, :cubic
    perimeter_count::Int64
    solid_layers_top::Int64
    solid_layers_bottom::Int64
    support_material::Bool
    support_angle::Float64
    support_pattern::Symbol  # :grid, :lines
    support_density::Float64
    bridge_detection::Bool
    bridge_angle::Float64
    min_bridge_length::Float64
    temperature::Float64
    bed_temperature::Float64
    fan_speed::Float64
    fan_speed_bridges::Float64
    avoid_crossing_perimeters::Bool
    seam_position::Symbol  # :nearest, :random, :aligned
end

# Vector operations
function vec_add(a::Vector3D, b::Vector3D)::Vector3D
    Vector3D(a.x + b.x, a.y + b.y, a.z + b.z)
end

function vec_sub(a::Vector3D, b::Vector3D)::Vector3D
    Vector3D(a.x - b.x, a.y - b.y, a.z - b.z)
end

function vec_scale(v::Vector3D, s::Float64)::Vector3D
    Vector3D(v.x * s, v.y * s, v.z * s)
end

function vec_dot(a::Vector3D, b::Vector3D)::Float64
    a.x * b.x + a.y * b.y + a.z * b.z
end

function vec_cross(a::Vector3D, b::Vector3D)::Vector3D
    Vector3D(
        a.y * b.z - a.z * b.y,
        a.z * b.x - a.x * b.z,
        a.x * b.y - a.y * b.x
    )
end

function vec_length(v::Vector3D)::Float64
    sqrt(v.x * v.x + v.y * v.y + v.z * v.z)
end

function vec_normalize(v::Vector3D)::Vector3D
    len = vec_length(v)
    Vector3D(v.x / len, v.y / len, v.z / len)
end

function vec_distance(a::Vector3D, b::Vector3D)::Float64
    vec_length(vec_sub(b, a))
end

# STL file parsing
function read_stl(filename::String)::Mesh
    if is_binary_stl(filename)
        return read_binary_stl(filename)
    else
        return read_ascii_stl(filename)
    end
end

function is_binary_stl(filename::String)::Bool
    filesize = stat(filename).size
    open(filename, "r") do file
        header = read(file, 5)
        return !startswith(String(header), "solid")
    end
end

function read_binary_stl(filename::String)::Mesh
    vertices = Vector3D[]
    faces = Face[]
    edges = Edge[]
    
    open(filename, "r") do file
        # Skip header
        skip(file, 80)
        
        # Read triangle count
        triangle_count = read(file, UInt32)
        
        for _ in 1:triangle_count
            # Read normal
            nx = read(file, Float32)
            ny = read(file, Float32)
            nz = read(file, Float32)
            normal = Vector3D(Float64(nx), Float64(ny), Float64(nz))
            
            # Read vertices
            face_vertices = Vector3D[]
            for _ in 1:3
                x = read(file, Float32)
                y = read(file, Float32)
                z = read(file, Float32)
                vertex = Vector3D(Float64(x), Float64(y), Float64(z))
                push!(face_vertices, vertex)
                push!(vertices, vertex)
            end
            
            # Create edges
            face_edges = Edge[]
            for i in 1:3
                start_vertex = face_vertices[i]
                end_vertex = face_vertices[mod1(i+1, 3)]
                edge = Edge(start_vertex, end_vertex, nothing, nothing)
                push!(face_edges, edge)
                push!(edges, edge)
            end
            
            # Create face
            face = Face(face_vertices, normal, face_edges)
            
            # Update edge face references
            for edge in face_edges
                edge.face = face
            end
            
            push!(faces, face)
            
            # Skip attribute byte count
            skip(file, 2)
        end
    end
    
    # Link twin edges
    link_twin_edges!(edges)
    
    # Calculate bounding box
    bounds = calculate_bounds(vertices)
    
    return Mesh(vertices, faces, edges, bounds)
end

function read_ascii_stl(filename::String)::Mesh
    vertices = Vector3D[]
    faces = Face[]
    edges = Edge[]
    current_vertices = Vector3D[]
    current_normal = nothing
    
    open(filename, "r") do file
        for line in eachline(file)
            tokens = split(strip(line))
            
            if isempty(tokens)
                continue
            end
            
            if tokens[1] == "facet" && tokens[2] == "normal"
                current_normal = Vector3D(
                    parse(Float64, tokens[3]),
                    parse(Float64, tokens[4]),
                    parse(Float64, tokens[5])
                )
            elseif tokens[1] == "vertex"
                vertex = Vector3D(
                    parse(Float64, tokens[2]),
                    parse(Float64, tokens[3]),
                    parse(Float64, tokens[4])
                )
                push!(current_vertices, vertex)
                push!(vertices, vertex)
            elseif tokens[1] == "endfacet"
                # Create edges
                face_edges = Edge[]
                for i in 1:3
                    edge = Edge(
                        current_vertices[i],
                        current_vertices[mod1(i+1, 3)],
                        nothing,
                        nothing
                    )
                    push!(face_edges, edge)
                    push!(edges, edge)
                end
                
                # Create face
                face = Face(copy(current_vertices), current_normal, face_edges)
                
                # Update edge face references
                for edge in face_edges
                    edge.face = face
                end
                
                push!(faces, face)
                empty!(current_vertices)
            end
        end
    end
    
    # Link twin edges
    link_twin_edges!(edges)
    
    # Calculate bounding box
    bounds = calculate_bounds(vertices)
    
    return Mesh(vertices, faces, edges, bounds)
end

function link_twin_edges!(edges::Vector{Edge})
    for i in 1:length(edges)
        if edges[i].twin !== nothing
            continue
        end
        
        # Find potential twin edge
        for j in (i+1):length(edges)
            if edges[j].twin !== nothing
                continue
            end
            
            if is_twin_edge(edges[i], edges[j])
                edges[i].twin = edges[j]
                edges[j].twin = edges[i]
                break
            end
        end
    end
end

function is_twin_edge(e1::Edge, e2::Edge)::Bool
    return vec_distance(e1.start, e2.endp) < 1e-6 && 
           vec_distance(e1.endp, e2.start) < 1e-6
end

function calculate_bounds(vertices::Vector{Vector3D})::BoundingBox
    min_x = min_y = min_z = Inf
    max_x = max_y = max_z = -Inf
    
    for v in vertices
        min_x = min(min_x, v.x)
        max_x = max(max_x, v.x)
        min_y = min(min_y, v.y)
        max_y = max(max_y, v.y)
        min_z = min(min_z, v.z)
        max_z = max(max_z, v.z)
    end
    
    return BoundingBox(min_x, max_x, min_y, max_y, min_z, max_z)
end

function get_perimeter_bounds(perimeters::Vector{Vector{Vector3D}})::BoundingBox
    min_x = min_y = min_z = Inf
    max_x = max_y = max_z = -Inf
    
    for perimeter in perimeters
        for point in perimeter
            min_x = min(min_x, point.x)
            max_x = max(max_x, point.x)
            min_y = min(min_y, point.y)
            max_y = max(max_y, point.y)
            min_z = min(min_z, point.z)
            max_z = max(max_z, point.z)
        end
    end
    
    # Ensure we have valid bounds even if no points were processed
    if min_x == Inf
        min_x = max_x = min_y = max_y = min_z = max_z = 0.0
    end
    
    return BoundingBox(min_x, max_x, min_y, max_y, min_z, max_z)
end

# Enhanced mesh repair function
function repair_mesh!(mesh::Mesh)::Bool
    repaired = false
    
    # Remove degenerate faces
    non_degenerate_faces = filter(!is_degenerate_face, mesh.faces)
    if length(non_degenerate_faces) != length(mesh.faces)
        mesh.faces = non_degenerate_faces
        repaired = true
    end
    
    # Fix face orientations
    if fix_face_orientations!(mesh)
        repaired = true
    end
    
    # Attempt to fix non-manifold edges
    if fix_non_manifold_edges!(mesh)
        repaired = true
    end
    
    return repaired
end

function fix_face_orientations!(mesh::Mesh)::Bool
    fixed = false
    
    # Build adjacency graph
    adjacency = Dict()
    for face in mesh.faces
        adjacency[face] = Set{Face}()
    end
    
    for edge in mesh.edges
        if edge.twin !== nothing
            push!(adjacency[edge.face], edge.twin.face)
            push!(adjacency[edge.twin.face], edge.face)
        end
    end
    
    # Start with a reference face
    reference_face = mesh.faces[1]
    visited = Set{Face}([reference_face])
    queue = [(reference_face, true)]  # (face, should_flip)
    
    while !isempty(queue)
        current_face, should_flip = popfirst!(queue)
        
        if should_flip
            # Flip face orientation
            reverse!(current_face.vertices)
            current_face.normal = vec_scale(current_face.normal, -1.0)
            fixed = true
        end
        
        for neighbor in adjacency[current_face]
            if neighbor ∉ visited
                push!(visited, neighbor)
                shared_edge = find_shared_edge(current_face, neighbor)
                if shared_edge !== nothing
                    should_flip_neighbor = !is_face_oriented_with_edge(neighbor, shared_edge)
                    push!(queue, (neighbor, should_flip_neighbor))
                end
            end
        end
    end
    
    return fixed
end

function fix_non_manifold_edges!(mesh::Mesh)::Bool
    fixed = false
    edge_count = Dict()
    
    # Count edges
    for edge in mesh.edges
        key = sort([hash(edge.start), hash(edge.endp)])
        edge_count[key] = get(edge_count, key, 0) + 1
    end
    
    # Remove redundant edges
    to_remove = Edge[]
    for edge in mesh.edges
        key = sort([hash(edge.start), hash(edge.endp)])
        if edge_count[key] > 2
            push!(to_remove, edge)
            edge_count[key] -= 1
            fixed = true
        end
    end
    
    # Update mesh
    if !isempty(to_remove)
        filter!(e -> e ∉ to_remove, mesh.edges)
        for face in mesh.faces
            filter!(e -> e ∉ to_remove, face.edges)
        end
    end
    
    return fixed
end

function clip_line_to_perimeters(line::Vector{Vector3D}, perimeters::Vector{Vector{Vector3D}})::Vector{Vector{Vector3D}}
    clipped_lines = Vector{Vector{Vector3D}}()
    
    # Convert perimeters to 2D for intersection testing
    perimeters_2d = [[(p.x, p.y) for p in perimeter] for perimeter in perimeters]
    line_2d = [(line[1].x, line[1].y), (line[2].x, line[2].y)]
    z = line[1].z  # Store Z coordinate
    
    # Find all intersection points
    intersections = Vector{Tuple{Float64, Float64}}()
    for perimeter in perimeters_2d
        for i in 1:length(perimeter)
            p1 = perimeter[i]
            p2 = perimeter[mod1(i+1, length(perimeter))]
            
            intersection = line_segment_intersection(
                line_2d[1], line_2d[2],
                p1, p2
            )
            
            if intersection !== nothing
                push!(intersections, intersection)
            end
        end
    end
    
    # Sort intersections by distance from start
    sort!(intersections, by=p -> point_distance_2d(line_2d[1], p))
    
    # Create line segments between pairs of intersections
    for i in 1:2:length(intersections)
        if i+1 > length(intersections)
            break
        end
        
        start_point = Vector3D(intersections[i][1], intersections[i][2], z)
        end_point = Vector3D(intersections[i+1][1], intersections[i+1][2], z)
        
        # Only add the segment if it's inside the perimeter
        mid_point = vec_scale(vec_add(start_point, end_point), 0.5)
        if point_in_perimeters(mid_point, perimeters)
            push!(clipped_lines, [start_point, end_point])
        end
    end
    
    return clipped_lines  # Will return an empty vector if no intersections found
end


function line_segment_intersection(
    l1p1::Tuple{Float64, Float64}, 
    l1p2::Tuple{Float64, Float64},
    l2p1::Tuple{Float64, Float64}, 
    l2p2::Tuple{Float64, Float64}
)::Union{Nothing, Tuple{Float64, Float64}}
    # Calculate denominators
    d = (l1p2[1] - l1p1[1]) * (l2p2[2] - l2p1[2]) - 
        (l1p2[2] - l1p1[2]) * (l2p2[1] - l2p1[1])
        
    println("Debug Intersection - d = $d")
    println("Line 1: $(l1p1) to $(l1p2)")
    println("Line 2: $(l2p1) to $(l2p2)")
    
    if abs(d) < 1e-6  # Increased threshold for parallel detection
        println("Debug Intersection - Lines are parallel")
        return nothing
    end
    
    # Calculate intersection parameters
    ua = ((l2p2[1] - l2p1[1]) * (l1p1[2] - l2p1[2]) - 
          (l2p2[2] - l2p1[2]) * (l1p1[1] - l2p1[1])) / d
    ub = ((l1p2[1] - l1p1[1]) * (l1p1[2] - l2p1[2]) - 
          (l1p2[2] - l1p1[2]) * (l1p1[1] - l2p1[1])) / d
          
    println("Debug Intersection - ua = $ua, ub = $ub")
end

function point_distance_2d(p1::Tuple{Float64, Float64}, p2::Tuple{Float64, Float64})::Float64
    dx = p2[1] - p1[1]
    dy = p2[2] - p1[2]
    return sqrt(dx * dx + dy * dy)
end

function point_in_perimeters(point::Vector3D, perimeters::Vector{Vector{Vector3D}})::Bool
    point_2d = (point.x, point.y)
    winding_number = 0
    
    for perimeter in perimeters
        for i in 1:length(perimeter)
            p1 = perimeter[i]
            p2 = perimeter[mod1(i+1, length(perimeter))]
            
            if p1.y <= point.y
                if p2.y > point.y && is_left((p1.x, p1.y), (p2.x, p2.y), point_2d) > 0
                    winding_number += 1
                end
            else
                if p2.y <= point.y && is_left((p1.x, p1.y), (p2.x, p2.y), point_2d) < 0
                    winding_number -= 1
                end
            end
        end
    end
    
    return winding_number != 0
end

function detect_support_regions(perimeters::Vector{Vector{Vector3D}}, support_angle::Float64)::Vector{Vector{Vector3D}}
    support_regions = Vector{Vector{Vector3D}}()
    
    # Convert support angle to radians
    angle_rad = support_angle * π / 180.0
    min_cos = cos(angle_rad)
    
    # Analyze each perimeter for overhanging segments
    for perimeter in perimeters
        current_region = Vector{Vector3D}()
        
        for i in 1:length(perimeter)
            p1 = perimeter[i]
            p2 = perimeter[mod1(i+1, length(perimeter))]
            
            # Calculate segment vector and angle with vertical
            dx = p2.x - p1.x
            dy = p2.y - p1.y
            dz = p2.z - p1.z
            
            length = sqrt(dx*dx + dy*dy + dz*dz)
            if length < 1e-6
                continue
            end
            
            # Calculate cosine of angle with vertical
            cos_angle = abs(dz) / length
            
            # If angle exceeds support angle, add to support region
            if cos_angle < min_cos
                if isempty(current_region)
                    push!(current_region, p1)
                end
                push!(current_region, p2)
            else
                if !isempty(current_region)
                    if length(current_region) >= 2
                        push!(support_regions, copy(current_region))
                    end
                    empty!(current_region)
                end
            end
        end
        
        # Add any remaining region
        if length(current_region) >= 2
            push!(support_regions, current_region)
        end
    end
    
    return support_regions
end

function generate_grid_supports(regions::Vector{Vector{Vector3D}}, z::Float64, config::PrintConfig)::Vector{Vector{Vector3D}}
    support_paths = Vector{Vector{Vector3D}}()
    
    if isempty(regions)
        return support_paths
    end
    
    # Calculate bounds of support regions
    bounds = get_regions_bounds(regions)
    
    # Calculate grid spacing based on density
    spacing = config.nozzle_diameter * 4 / config.support_density
    
    # Generate horizontal support lines
    y = bounds.min_y
    while y <= bounds.max_y
        line = [
            Vector3D(bounds.min_x, y, z),
            Vector3D(bounds.max_x, y, z)
        ]
        
        # Clip line to support regions
        clipped = clip_line_to_regions(line, regions)
        append!(support_paths, clipped)
        
        y += spacing
    end
    
    # Generate vertical support lines
    x = bounds.min_x
    while x <= bounds.max_x
        line = [
            Vector3D(x, bounds.min_y, z),
            Vector3D(x, bounds.max_y, z)
        ]
        
        # Clip line to support regions
        clipped = clip_line_to_regions(line, regions)
        append!(support_paths, clipped)
        
        x += spacing
    end
    
    return support_paths
end

function generate_line_supports(regions::Vector{Vector{Vector3D}}, z::Float64, config::PrintConfig)::Vector{Vector{Vector3D}}
    support_paths = Vector{Vector{Vector3D}}()
    
    if isempty(regions)
        return support_paths
    end
    
    # Calculate bounds of support regions
    bounds = get_regions_bounds(regions)
    
    # Calculate line spacing based on density
    spacing = config.nozzle_diameter * 4 / config.support_density
    
    # Generate support lines at 45-degree angle
    x = bounds.min_x - (bounds.max_y - bounds.min_y)
    while x <= bounds.max_x
        line = [
            Vector3D(x, bounds.min_y, z),
            Vector3D(x + (bounds.max_y - bounds.min_y), bounds.max_y, z)
        ]
        
        # Clip line to support regions
        clipped = clip_line_to_regions(line, regions)
        append!(support_paths, clipped)
        
        x += spacing
    end
    
    return support_paths
end

function get_regions_bounds(regions::Vector{Vector{Vector3D}})::BoundingBox
    min_x = min_y = min_z = Inf
    max_x = max_y = max_z = -Inf
    
    for region in regions
        for point in region
            min_x = min(min_x, point.x)
            max_x = max(max_x, point.x)
            min_y = min(min_y, point.y)
            max_y = max(max_y, point.y)
            min_z = min(min_z, point.z)
            max_z = max(max_z, point.z)
        end
    end
    
    if min_x == Inf
        min_x = max_x = min_y = max_y = min_z = max_z = 0.0
    end
    
    return BoundingBox(min_x, max_x, min_y, max_y, min_z, max_z)
end

function clip_line_to_regions(line::Vector{Vector3D}, regions::Vector{Vector{Vector3D}})::Vector{Vector{Vector3D}}
    clipped_lines = Vector{Vector{Vector3D}}()
    
    for region in regions
        # Convert the current region to 2D polygon
        region_2d = [(p.x, p.y) for p in region]
        line_2d = [(line[1].x, line[1].y), (line[2].x, line[2].y)]
        z = line[1].z
        
        # Find intersections
        intersections = get_polygon_line_intersections(region_2d, line_2d)
        
        # Sort intersections by distance from start
        sort!(intersections, by=p -> point_distance_2d(line_2d[1], p))
        
        # Create line segments between pairs of intersections
        for i in 1:2:length(intersections)
            if i+1 > length(intersections)
                break
            end
            
            start_point = Vector3D(intersections[i][1], intersections[i][2], z)
            end_point = Vector3D(intersections[i+1][1], intersections[i+1][2], z)
            push!(clipped_lines, [start_point, end_point])
        end
    end
    
    return clipped_lines
end

function get_polygon_line_intersections(
    polygon::Vector{Tuple{Float64, Float64}}, 
    line::Vector{Tuple{Float64, Float64}}
)::Vector{Tuple{Float64, Float64}}
    intersections = Vector{Tuple{Float64, Float64}}()
    
    for i in 1:length(polygon)
        p1 = polygon[i]
        p2 = polygon[mod1(i+1, length(polygon))]
        
        intersection = line_segment_intersection(line[1], line[2], p1, p2)
        if intersection !== nothing
            push!(intersections, intersection)
        end
    end
    
    return intersections
end

function generate_perimeter_gcode(perimeter::Vector{Vector3D}, config::PrintConfig, layer_idx::Int)::Vector{String}
    gcode = String[]
    
    # Calculate extrusion parameters
    layer_height = (layer_idx == 1) ? config.initial_layer_height : config.layer_height
    extrusion_width = config.nozzle_diameter
    speed = layer_idx == 1 ? config.initial_layer_speed : config.perimeter_speed
    
    # Move to start point
    push!(gcode, @sprintf("G1 F%.1f ; Set travel speed", config.travel_speed))
    push!(gcode, @sprintf("G0 X%.3f Y%.3f ; Move to start", perimeter[1].x, perimeter[1].y))
    
    # Reset extrusion distance
    push!(gcode, "G92 E0")
    
    # Print perimeter
    for i in 2:length(perimeter)
        prev = perimeter[i-1]
        curr = perimeter[i]
        
        # Calculate extrusion amount
        distance = vec_distance(prev, curr)
        extrusion = calculate_extrusion(distance, layer_height, extrusion_width, config)
        
        # Add movement command with extrusion
        push!(gcode, @sprintf("G1 X%.3f Y%.3f E%.4f F%.1f", 
            curr.x, curr.y, extrusion, speed))
    end
    
    # Close the loop if needed
    if vec_distance(perimeter[end], perimeter[1]) > 0.01
        distance = vec_distance(perimeter[end], perimeter[1])
        extrusion = calculate_extrusion(distance, layer_height, extrusion_width, config)
        push!(gcode, @sprintf("G1 X%.3f Y%.3f E%.4f F%.1f", 
            perimeter[1].x, perimeter[1].y, extrusion, speed))
    end
    
    return gcode
end

function generate_infill_gcode(paths::Vector{Vector{Vector3D}}, config::PrintConfig, layer_idx::Int)::Vector{String}
    gcode = String[]
    
    if isempty(paths)
        return gcode
    end
    
    # Calculate extrusion parameters
    layer_height = (layer_idx == 1) ? config.initial_layer_height : config.layer_height
    extrusion_width = config.nozzle_diameter
    speed = layer_idx == 1 ? config.initial_layer_speed : config.infill_speed
    
    # Start with retraction
    push!(gcode, @sprintf("G1 E-%.3f F%.1f ; Retract", 
        config.retraction_distance, config.retraction_speed * 60))
    
    for path in paths
        if length(path) < 2
            continue
        end
        
        # Move to start of path
        push!(gcode, @sprintf("G0 X%.3f Y%.3f F%.1f", 
            path[1].x, path[1].y, config.travel_speed))
            
        # Un-retract
        push!(gcode, @sprintf("G1 E%.3f F%.1f ; Un-retract", 
            config.retraction_distance, config.retraction_speed * 60))
        
        # Reset extrusion distance
        push!(gcode, "G92 E0")
        
        # Print infill line
        for i in 2:length(path)
            prev = path[i-1]
            curr = path[i]
            
            distance = vec_distance(prev, curr)
            extrusion = calculate_extrusion(distance, layer_height, extrusion_width, config)
            
            push!(gcode, @sprintf("G1 X%.3f Y%.3f E%.4f F%.1f", 
                curr.x, curr.y, extrusion, speed))
        end
        
        # Retract at end of path
        push!(gcode, @sprintf("G1 E-%.3f F%.1f ; Retract", 
            config.retraction_distance, config.retraction_speed * 60))
    end
    
    return gcode
end

function generate_support_gcode(paths::Vector{Vector{Vector3D}}, config::PrintConfig)::Vector{String}
    gcode = String[]
    
    if isempty(paths)
        return gcode
    end
    
    # Use similar settings to infill but with support-specific parameters
    push!(gcode, @sprintf("G1 F%.1f ; Set support speed", config.support_speed))
    
    for path in paths
        if length(path) < 2
            continue
        end
        
        # Move to start
        push!(gcode, @sprintf("G0 X%.3f Y%.3f", path[1].x, path[1].y))
        
        # Print support line
        for i in 2:length(path)
            prev = path[i-1]
            curr = path[i]
            
            distance = vec_distance(prev, curr)
            extrusion = calculate_extrusion(distance, config.layer_height, 
                                         config.nozzle_diameter, config)
            
            push!(gcode, @sprintf("G1 X%.3f Y%.3f E%.4f", 
                curr.x, curr.y, extrusion))
        end
    end
    
    return gcode
end

function generate_bridge_gcode(paths::Vector{Vector{Vector3D}}, config::PrintConfig)::Vector{String}
    gcode = String[]
    
    if isempty(paths)
        return gcode
    end
    
    # Use bridge-specific settings
    push!(gcode, @sprintf("G1 F%.1f ; Set bridge speed", config.bridge_speed))
    
    for path in paths
        if length(path) < 2
            continue
        end
        
        # Move to start
        push!(gcode, @sprintf("G0 X%.3f Y%.3f", path[1].x, path[1].y))
        
        # Print bridge line with modified flow rate
        for i in 2:length(path)
            prev = path[i-1]
            curr = path[i]
            
            distance = vec_distance(prev, curr)
            extrusion = calculate_extrusion(distance, config.layer_height, 
                                         config.nozzle_diameter, config) * 
                                         config.bridge_flow_ratio
            
            push!(gcode, @sprintf("G1 X%.3f Y%.3f E%.4f", 
                curr.x, curr.y, extrusion))
        end
    end
    
    return gcode
end

function calculate_extrusion(distance::Float64, layer_height::Float64, 
                           width::Float64, config::PrintConfig)::Float64
    # Calculate volume of filament needed
    volume = distance * layer_height * width
    
    # Calculate length of filament needed
    filament_area = π * (config.filament_diameter / 2)^2
    filament_length = (volume / filament_area) * config.extrusion_multiplier
    
    return filament_length
end

function is_left(p1::Tuple{Float64, Float64}, p2::Tuple{Float64, Float64}, point::Tuple{Float64, Float64})::Float64
    return (p2[1] - p1[1]) * (point[2] - p1[2]) - 
           (point[1] - p1[1]) * (p2[2] - p1[2])
end

function validate_mesh(mesh::Mesh)::Tuple{Bool, Vector{String}}
    issues = String[]
    
    # Safety check for null mesh
    if isnothing(mesh) || isempty(mesh.faces) || isempty(mesh.edges)
        push!(issues, "Empty or invalid mesh")
        return (false, issues)
    end
    
    # Check for degenerate faces
    for (i, face) in enumerate(mesh.faces)
        if is_degenerate_face(face)
            push!(issues, "Degenerate face found at index $i")
        end
    end
    
    # Check for non-manifold edges
    edge_count = Dict()
    for edge in mesh.edges
        key = sort([hash(edge.start), hash(edge.endp)])
        edge_count[key] = get(edge_count, key, 0) + 1
    end
    
    for (edge, count) in edge_count
        if count > 2
            push!(issues, "Non-manifold edge found")
        elseif count == 1
            push!(issues, "Border edge found (mesh not watertight)")
        end
    end
    
    # Check for consistent face orientation
    if !check_face_orientation(mesh)
        push!(issues, "Inconsistent face orientation detected")
    end
    
    # Explicitly return the tuple
    return (isempty(issues), issues)
end

function compare_vertices(v1::Vector3D, v2::Vector3D, epsilon::Float64=1e-6)::Bool
    return abs(v1.x - v2.x) < epsilon &&
           abs(v1.y - v2.y) < epsilon && 
           abs(v1.z - v2.z) < epsilon
end

function get_edge_key(start::Vector3D, endp::Vector3D)::Tuple{Float64, Float64, Float64, Float64, Float64, Float64}
    # Sort endpoints consistently
    if start.x < endp.x || (start.x == endp.x && start.y < endp.y) || 
       (start.x == endp.x && start.y == endp.y && start.z < endp.z)
        return (start.x, start.y, start.z, endp.x, endp.y, endp.z)
    else
        return (endp.x, endp.y, endp.z, start.x, start.y, start.z)
    end
end

function is_degenerate_face(face::Face)::Bool
    # Check if face area is too small
    v1 = vec_sub(face.vertices[2], face.vertices[1])
    v2 = vec_sub(face.vertices[3], face.vertices[1])
    area = vec_length(vec_cross(v1, v2)) / 2
    return area < 1e-10
end

function check_face_orientation(mesh::Mesh)::Bool
    # Build adjacency graph
    adjacency = Dict()
    for face in mesh.faces
        adjacency[face] = Set{Face}()
    end
    
    for edge in mesh.edges
        if edge.twin !== nothing
            push!(adjacency[edge.face], edge.twin.face)
            push!(adjacency[edge.twin.face], edge.face)
        end
    end
    
    # Check orientation consistency using BFS
    visited = Set{Face}()
    queue = [mesh.faces[1]]
    face_orientation = Dict(mesh.faces[1] => true)
    
    while !isempty(queue)
        current = popfirst!(queue)
        push!(visited, current)
        
        for neighbor in adjacency[current]
            if neighbor ∉ visited
                # Check relative orientation
                shared_edge = find_shared_edge(current, neighbor)
                if shared_edge === nothing
                    continue
                end
                
                expected_orientation = !face_orientation[current]
                actual_orientation = is_face_oriented_with_edge(neighbor, shared_edge)
                
                if actual_orientation != expected_orientation
                    return false
                end
                
                face_orientation[neighbor] = actual_orientation
                push!(queue, neighbor)
            end
        end
    end
    
    return true
end

function find_shared_edge(f1::Face, f2::Face)::Union{Nothing, Edge}
    for edge in f1.edges
        if edge.twin !== nothing && edge.twin.face === f2
            return edge
        end
    end
    return nothing
end

function is_face_oriented_with_edge(face::Face, edge::Edge)::Bool
    # Check if edge direction matches face vertex order
    for i in 1:3
        if face.vertices[i] === edge.start && 
           face.vertices[mod1(i+1, 3)] === edge.endp
            return true
        end
    end
    return false
end

# Slicing functions
function slice_mesh(mesh::Mesh, config::PrintConfig)::Vector{Layer}
    layers = Layer[]
    
    # Calculate number of layers
    total_height = mesh.bounds.max_z - mesh.bounds.min_z
    num_layers = ceil(Int, total_height / config.layer_height)
    
    # Start at minimum Z
    current_z = mesh.bounds.min_z + config.initial_layer_height
    
    println("Total height: $(total_height)mm, generating $num_layers layers")
    
    for layer_idx in 1:num_layers
        println("\nProcessing layer $layer_idx at z=$current_z")
        
        # Find intersecting faces
        intersecting_faces = filter(face -> 
            face_intersects_plane(face, current_z), mesh.faces)
            
        println("Found $(length(intersecting_faces)) intersecting faces")
        
        if !isempty(intersecting_faces)
            println("First intersecting face vertices:")
            for (i, v) in enumerate(intersecting_faces[1].vertices)
                println("  v$i: ($(v.x), $(v.y), $(v.z))")
            end
        end
        
        # Generate layer contours
        layer_contours = generate_contours(intersecting_faces, current_z)
        println("Generated $(length(layer_contours)) contours")
        
        if !isempty(layer_contours)
            println("First contour points:")
            for (i, p) in enumerate(layer_contours[1])
                println("  p$i: ($(p.x), $(p.y), $(p.z))")
            end
        end
        
        # Generate perimeters
        perimeters = Vector{Vector{Vector3D}}()
        if !isempty(layer_contours)
            perimeters = generate_perimeters(layer_contours, config)
            println("Generated $(length(perimeters)) perimeters")
        end
        
        # Generate infill
        infill = Vector{Vector{Vector3D}}()
        if !isempty(perimeters)
            infill = generate_infill(perimeters, current_z, config)
            println("Generated $(length(infill)) infill paths")
        end
        
        # Create layer even if empty to maintain proper spacing
        push!(layers, Layer(current_z, perimeters, infill, Vector{Vector{Vector3D}}(), Vector{Vector{Vector3D}}()))
        current_z += config.layer_height
    end
    
    return layers
end


# Improved face intersection test
function face_intersects_plane(face::Face, z::Float64)::Bool
    min_z = minimum(v.z for v in face.vertices)
    max_z = maximum(v.z for v in face.vertices)
    return (min_z - 1e-6 <= z <= max_z + 1e-6)  # Add small epsilon for floating point comparison
end
function face_intersects_plane(face::Face, z::Float64)::Bool
    min_z = minimum(v.z for v in face.vertices)
    max_z = maximum(v.z for v in face.vertices)
    return min_z <= z <= max_z
end

function generate_contours(faces::Vector{Face}, z::Float64)::Vector{Vector{Vector3D}}
    segments = Vector{Tuple{Vector3D, Vector3D}}()
    
    for face in faces
        # Get intersection segments for this face
        face_segments = intersect_face_plane(face, z)
        
        # Append each segment individually
        for segment in face_segments
            push!(segments, segment)
        end
    end
    
    return connect_segments(segments)
end

function intersect_face_plane(face::Face, z::Float64)::Vector{Tuple{Vector3D, Vector3D}}
    intersections = Vector{Vector3D}()
    segments = Vector{Tuple{Vector3D, Vector3D}}()
    
    # Check each edge for intersection
    for i in 1:length(face.vertices)
        v1 = face.vertices[i]
        v2 = face.vertices[mod1(i+1, length(face.vertices))]
        
        if (v1.z <= z && v2.z >= z) || (v1.z >= z && v2.z <= z)
            # Avoid division by zero
            if abs(v2.z - v1.z) > 1e-10
                t = (z - v1.z) / (v2.z - v1.z)
                x = v1.x + t * (v2.x - v1.x)
                y = v1.y + t * (v2.y - v1.y)
                push!(intersections, Vector3D(x, y, z))
            end
        end
    end
    
    # If we found exactly 2 intersection points, create a segment
    if length(intersections) == 2
        push!(segments, (intersections[1], intersections[2]))
    end
    
    return segments
end

function connect_segments(segments::Vector{Tuple{Vector3D, Vector3D}})::Vector{Vector{Vector3D}}
    if isempty(segments)
        return Vector{Vector{Vector3D}}()
    end
    
    contours = Vector{Vector{Vector3D}}()
    remaining = copy(segments)
    
    while !isempty(remaining)
        current_contour = Vector{Vector3D}()
        start_segment = popfirst!(remaining)
        push!(current_contour, start_segment[1], start_segment[2])
        
        connection_found = true
        while connection_found && !isempty(remaining)
            connection_found = false
            current_point = current_contour[end]
            
            # Try to find a connecting segment
            for (i, segment) in enumerate(remaining)
                if vec_distance(current_point, segment[1]) < 1e-6
                    push!(current_contour, segment[2])
                    deleteat!(remaining, i)
                    connection_found = true
                    break
                elseif vec_distance(current_point, segment[2]) < 1e-6
                    push!(current_contour, segment[1])
                    deleteat!(remaining, i)
                    connection_found = true
                    break
                end
            end
            
            # Check if we've closed the loop
            if !isempty(current_contour) && 
               vec_distance(current_contour[end], current_contour[1]) < 1e-6
                break
            end
        end
        
        # Only keep contours with at least 3 points
        if length(current_contour) >= 3
            push!(contours, current_contour)
        end
    end
    
    return contours
end
function generate_perimeters(contours::Vector{Vector{Vector3D}}, config::PrintConfig)::Vector{Vector{Vector3D}}
    perimeters = Vector{Vector{Vector3D}}()
    
    for contour in contours
        # Add original contour as outer perimeter
        push!(perimeters, contour)
        
        # Generate inset perimeters
        last_perimeter = contour
        for i in 2:config.perimeter_count
            offset = (i - 1) * config.nozzle_diameter
            inset = offset_polygon(last_perimeter, offset)
            
            if length(inset) >= 3
                push!(perimeters, inset)
                last_perimeter = inset
            else
                break
            end
        end
    end
    
    return perimeters
end

function offset_polygon(polygon::Vector{Vector3D}, distance::Float64)::Vector{Vector3D}
    if length(polygon) < 3
        return Vector{Vector3D}()
    end
    
    offset_points = Vector{Vector3D}()
    
    for i in 1:length(polygon)
        prev = polygon[mod1(i-1, length(polygon))]
        curr = polygon[i]
        next = polygon[mod1(i+1, length(polygon))]
        
        # Calculate normals of adjacent edges
        v1 = vec_normalize(vec_sub(curr, prev))
        v2 = vec_normalize(vec_sub(next, curr))
        
        # Calculate bisector
        bisector = vec_normalize(vec_add(v1, v2))
        
        # Calculate offset distance
        angle = acos(vec_dot(v1, v2))
        offset_dist = distance / sin(angle/2)
        
        # Calculate offset point
        offset_point = vec_add(curr, vec_scale(bisector, offset_dist))
        push!(offset_points, offset_point)
    end
    
    return offset_points
end

function generate_infill(perimeters::Vector{Vector{Vector3D}}, z::Float64, config::PrintConfig)::Vector{Vector{Vector3D}}
    if config.infill_density <= 0
        return Vector{Vector{Vector3D}}()
    end
    
    if config.infill_pattern == :honeycomb
        return generate_honeycomb_infill(perimeters, z, config)
    elseif config.infill_pattern == :grid
        return generate_grid_infill(perimeters, z, config)
    elseif config.infill_pattern == :triangles
        return generate_triangular_infill(perimeters, z, config)
    else
        return generate_cubic_infill(perimeters, z, config)
    end
end

function generate_honeycomb_infill(perimeters::Vector{Vector{Vector3D}}, z::Float64, config::PrintConfig)::Vector{Vector{Vector3D}}
    paths = Vector{Vector{Vector3D}}()
    bounds = get_perimeter_bounds(perimeters)
    
    # Calculate hex size based on density
    hex_size = config.nozzle_diameter * 4 / config.infill_density
    hex_height = hex_size * sqrt(3) / 2
    
    # Generate hexagon centers
    row = 0
    y = bounds.min_y
    while y <= bounds.max_y
        x = bounds.min_x + (row % 2) * (hex_size * 1.5)
        
        while x <= bounds.max_x
            center = Vector3D(x, y, z)
            
            if point_in_perimeters(center, perimeters)
                hex = generate_hexagon(center, hex_size, z)
                if all(p -> point_in_perimeters(p, perimeters), hex)
                    push!(paths, hex)
                end
            end
            
            x += hex_size * 3
        end
        
        y += hex_height
        row += 1
    end
    
    return paths
end


function generate_grid_infill(perimeters::Vector{Vector{Vector3D}}, z::Float64, config::PrintConfig)::Vector{Vector{Vector3D}}
    paths = Vector{Vector{Vector3D}}()
    
    # Get clean, guaranteed bounds from perimeters
    bounds = get_safe_bounds(perimeters)
    
    # Use default values if config values are invalid
    spacing = if isnan(config.nozzle_diameter) || isnan(config.infill_density) || config.infill_density <= 0
        2.0  # Default 2mm spacing if config is invalid
    else
        max(config.nozzle_diameter * 4 / config.infill_density, 0.1)  # Minimum 0.1mm spacing
    end
    
    # Ensure bounds are valid numbers
    x_min = bounds.min_x
    x_max = bounds.max_x
    y_min = bounds.min_y
    y_max = bounds.max_y
    
    # Safety check for invalid bounds
    if !isfinite(x_min) || !isfinite(x_max) || !isfinite(y_min) || !isfinite(y_max)
        println("Warning: Invalid bounds detected, using default bounds")
        x_min, x_max = 0.0, 100.0
        y_min, y_max = 0.0, 100.0
    end
    
    # Ensure z is a valid number
    z_height = isfinite(z) ? z : 0.0
    
    # Generate horizontal lines with explicit step count
    num_y_lines = max(floor(Int, (y_max - y_min) / spacing), 1)
    if num_y_lines > 0
        y_step = (y_max - y_min) / num_y_lines
        for i in 0:num_y_lines
            y = y_min + i * y_step
            path = [
                Vector3D(x_min, y, z_height),
                Vector3D(x_max, y, z_height)
            ]
            push!(paths, path)
        end
    end
    
    # Generate vertical lines with explicit step count
    num_x_lines = max(floor(Int, (x_max - x_min) / spacing), 1)
    if num_x_lines > 0
        x_step = (x_max - x_min) / num_x_lines
        for i in 0:num_x_lines
            x = x_min + i * x_step
            path = [
                Vector3D(x, y_min, z_height),
                Vector3D(x, y_max, z_height)
            ]
            push!(paths, path)
        end
    end
    
    return paths
end

function get_safe_bounds(perimeters::Vector{Vector{Vector3D}})::BoundingBox
    # Initialize with safe defaults
    min_x = Inf
    max_x = -Inf
    min_y = Inf
    max_y = -Inf
    min_z = Inf
    max_z = -Inf
    
    # Only process if we have perimeters
    if !isempty(perimeters)
        for perimeter in perimeters
            for point in perimeter
                # Only use points with valid coordinates
                if isfinite(point.x) && isfinite(point.y) && isfinite(point.z)
                    min_x = min(min_x, point.x)
                    max_x = max(max_x, point.x)
                    min_y = min(min_y, point.y)
                    max_y = max(max_y, point.y)
                    min_z = min(min_z, point.z)
                    max_z = max(max_z, point.z)
                end
            end
        end
    end
    
    # If no valid points were found, use safe defaults
    if !isfinite(min_x) || !isfinite(max_x) || !isfinite(min_y) || !isfinite(max_y) || !isfinite(min_z) || !isfinite(max_z)
        min_x = 0.0
        max_x = 100.0
        min_y = 0.0
        max_y = 100.0
        min_z = 0.0
        max_z = 20.0
    end
    
    return BoundingBox(min_x, max_x, min_y, max_y, min_z, max_z)
end

function generate_supports(perimeters::Vector{Vector{Vector3D}}, z::Float64, config::PrintConfig)::Vector{Vector{Vector3D}}
    if !config.support_material
        return Vector{Vector{Vector3D}}()
    end
    
    support_regions = detect_support_regions(perimeters, config.support_angle)
    
    if config.support_pattern == :grid
        return generate_grid_supports(support_regions, z, config)
    else
        return generate_line_supports(support_regions, z, config)
    end
end

function detect_bridges(perimeters::Vector{Vector{Vector3D}}, contours::Vector{Vector{Vector3D}}, 
                       z::Float64, config::PrintConfig)::Vector{Vector{Vector3D}}
    if !config.bridge_detection
        return Vector{Vector{Vector3D}}()
    end
    
    bridges = Vector{Vector{Vector3D}}()
    
    for perimeter in perimeters
        # Check for unsupported spans longer than min_bridge_length
        for i in 1:length(perimeter)-1
            span_start = perimeter[i]
            span_end = perimeter[i+1]
            span_length = vec_distance(span_start, span_end)
            
            if span_length >= config.min_bridge_length
                # Check if span is unsupported
                midpoint = vec_scale(vec_add(span_start, span_end), 0.5)
                midpoint = Vector3D(midpoint.x, midpoint.y, midpoint.z - config.layer_height)
                
                if !point_has_support(midpoint, contours)
                    # Generate bridge path
                    bridge_angle = config.bridge_angle * π / 180
                    bridge_path = generate_bridge_path(span_start, span_end, bridge_angle)
                    push!(bridges, bridge_path)
                end
            end
        end
    end
    
    return bridges
end

function generate_gcode(layers::Vector{Layer}, config::PrintConfig)::String
    gcode = String[]
    
    # Start G-code
    append!(gcode, generate_start_gcode(config))
    
    # Process each layer
    for (layer_idx, layer) in enumerate(layers)
        # Layer change
        push!(gcode, @sprintf("; Layer %d", layer_idx))
        push!(gcode, @sprintf("G1 Z%.3f F%.1f", layer.z, travel_speed(config, layer_idx)))
        
        # Print perimeters
        for perimeter in layer.perimeters
            append!(gcode, generate_perimeter_gcode(perimeter, config, layer_idx))
        end
        
        # Print infill
        append!(gcode, generate_infill_gcode(layer.infill_paths, config, layer_idx))
        
        # Print supports
        if !isempty(layer.support_paths)
            append!(gcode, generate_support_gcode(layer.support_paths, config))
        end
        
        # Print bridges
        if !isempty(layer.bridging_paths)
            append!(gcode, generate_bridge_gcode(layer.bridging_paths, config))
        end
    end
    
    # End G-code
    append!(gcode, generate_end_gcode())
    
    return join(gcode, "\n")
end

function travel_speed(config::PrintConfig, layer_idx::Int)::Float64
    return layer_idx == 1 ? config.initial_layer_speed : config.travel_speed
end

function print_speed(config::PrintConfig, layer_idx::Int)::Float64
    return layer_idx == 1 ? config.initial_layer_speed : config.print_speed
end

function generate_start_gcode(config::PrintConfig)::Vector{String}
    [
        "; Generated by Julia STL Slicer",
        "M104 S$(config.temperature) ; Set nozzle temperature",
        "M140 S$(config.bed_temperature) ; Set bed temperature",
        "M109 S$(config.temperature) ; Wait for nozzle temperature",
        "M190 S$(config.bed_temperature) ; Wait for bed temperature",
        "G28 ; Home all axes",
        "G21 ; Set units to millimeters",
        "G90 ; Use absolute coordinates",
        "M82 ; Use absolute distances for extrusion",
        "G92 E0 ; Reset extruder position",
        "M106 S$(config.fan_speed) ; Set fan speed"
    ]
end

function generate_end_gcode()::Vector{String}
    [
        "M104 S0 ; Turn off nozzle",
        "M140 S0 ; Turn off bed",
        "G91 ; Relative positioning",
        "G1 E-3 F1800 ; Retract filament",
        "G1 Z+10 ; Raise Z axis",
        "G90 ; Absolute positioning",
        "G28 X0 Y0 ; Home X and Y",
        "M84 ; Disable motors",
        "M106 S0 ; Turn off fan"
    ]
end

# Main processing function
function process_stl(input_file::String, output_file::String, config::PrintConfig)
    println("Reading STL file...")
    mesh = read_stl(input_file)
    
    println("\nMesh statistics:")
    println("- Number of vertices: $(length(mesh.vertices))")
    println("- Number of faces: $(length(mesh.faces))")
    println("- Number of edges: $(length(mesh.edges))")
    println("- Bounding box: min($(mesh.bounds.min_x), $(mesh.bounds.min_y), $(mesh.bounds.min_z)) max($(mesh.bounds.max_x), $(mesh.bounds.max_y), $(mesh.bounds.max_z))")
    
    println("\nValidating mesh...")
    valid, issues = validate_mesh(mesh)
    if !valid
        println("Warning: Mesh has issues:")
        for issue in issues
            println("  - $issue")
        end
    end
    
    println("\nSlicing mesh...")
    layers = slice_mesh(mesh, config)
    println("Generated $(length(layers)) layers")
    
    # Debug first few layers
    for (i, layer) in enumerate(layers[1:min(3, length(layers))])
        println("\nLayer $i statistics:")
        println("- Z height: $(layer.z)")
        println("- Number of perimeters: $(length(layer.perimeters))")
        println("- Number of infill paths: $(length(layer.infill_paths))")
        println("- Number of support paths: $(length(layer.support_paths))")
        println("- Number of bridge paths: $(length(layer.bridging_paths))")
        
        if !isempty(layer.perimeters)
            println("  First perimeter points: $(length(layer.perimeters[1]))")
        end
    end
    
    if all(layer -> isempty(layer.perimeters), layers)
        println("\nERROR: No geometry found in any layer! Possible issues:")
        println("1. STL file might be empty or corrupted")
        println("2. Model might be too small or too large")
        println("3. Model might not intersect with any slicing planes")
        return false
    end
    
    println("\nGenerating G-code...")
    gcode = generate_gcode(layers, config)
    
    println("\nWriting output file...")
    write(output_file, gcode)
    
    println("Processing complete!")
    return true
end
