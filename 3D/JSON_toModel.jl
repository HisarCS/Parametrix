#!/usr/bin/env julia

using JSON
using LinearAlgebra

# -------------------------------------------------------------------------
# 1) PARSE COMMAND STRINGS INTO JSON
#    e.g. "rectangle 4 6 on YZConstructionPlane at (1,2,0)"
# -------------------------------------------------------------------------
function parse_input_to_json(input_str::String)
    # We expect patterns like:
    #   "<shape> <numbers...> on <plane> at (x,y,z)"

    # We'll do a simple approach. Real-world usage might need robust parsing or regex.
    
    # Split into tokens
    tokens = split(input_str)

    # Identify shape
    shape = lowercase(tokens[1])  # e.g. "rectangle", "ellipse", "triangle", "circle"

    # We'll store "parameters" in a Dict
    params = Dict{String,Any}()

    # We'll search for "on ... at" parts. E.g. tokens might be:
    #   ["rectangle", "4", "6", "on", "YZConstructionPlane", "at", "(1,2,0)"]
    #
    # shape  = tokens[1]
    # plane  = tokens[4]
    # coords = tokens[6] (with parentheses)
    
    # We need to parse the numeric values that come after the shape but before "on".
    # For "ellipse major 10 minor 5 on ZXConstructionPlane at (2,3,1)", we have:
    #   tokens = ["ellipse", "major", "10", "minor", "5", "on", ...]
    # So let's parse them according to shape:
    
    # We'll do a simple method: everything from tokens[2] up to "on" is shape-specific data.
    # Then tokens after "on" until "at" is the plane. Then after "at" is the coordinates.
    
    # Find index of "on"
    idx_on = findfirst(x -> lowercase(x) == "on", tokens)
    # Find index of "at"
    idx_at = findfirst(x -> lowercase(x) == "at", tokens)

    if idx_on === nothing || idx_at === nothing
        error("Could not parse input. Expected 'on <Plane> at (x,y,z)'.")
    end

    plane_token = tokens[idx_on+1]            # e.g. "YZConstructionPlane"
    coords_str  = tokens[idx_at+1]           # e.g. "(1,2,0)"

    # parse coords_str into [x,y,z]
    # remove parentheses
    coords_str_clean = replace(coords_str, "(" => "")
    coords_str_clean = replace(coords_str_clean, ")" => "")
    coords_nums = split(coords_str_clean, ",")
    if length(coords_nums) != 3
        error("Coordinates must have 3 components.")
    end
    coords = [parse(Float64, c) for c in coords_nums]  # e.g. [1.0, 2.0, 0.0]

    # Now parse shape-specific data from tokens[2 : idx_on-1]
    shape_data = tokens[2:idx_on-1]

    if shape == "rectangle"
        # Expect 2 numeric values: width, height
        if length(shape_data) != 2
            error("Rectangle must have exactly 2 numbers: width height")
        end
        width  = parse(Float64, shape_data[1])
        height = parse(Float64, shape_data[2])
        params["width"]  = width
        params["height"] = height
        shape = "rectangle"

    elseif shape == "ellipse"
        # "ellipse major 10 minor 5 on ..."
        # shape_data could be ["major","10","minor","5"]
        # So let's parse those by key.
        # In a real scenario, you'd robustly handle the order.
        # We'll do a simple approach:
        d = Dict( shape_data[i] => shape_data[i+1] for i in 1:2:length(shape_data)-1 )
        # d = Dict("major" => "10", "minor" => "5")
        # Convert to numbers:
        major = parse(Float64, d["major"])
        minor = parse(Float64, d["minor"])
        params["major_radius"] = major
        params["minor_radius"] = minor
        shape = "ellipse"

    elseif shape == "triangle"
        # "triangle 3 4 5 on ..."
        # shape_data = ["3","4","5"]
        if length(shape_data) != 3
            error("Triangle must have exactly 3 sides: side1 side2 side3")
        end
        side1 = parse(Float64, shape_data[1])
        side2 = parse(Float64, shape_data[2])
        side3 = parse(Float64, shape_data[3])
        params["side1"] = side1
        params["side2"] = side2
        params["side3"] = side3
        shape = "triangle"

    elseif shape == "circle"
        # "circle 5 on ..."
        if length(shape_data) != 1
            error("Circle must have exactly 1 numeric radius")
        end
        radius = parse(Float64, shape_data[1])
        params["radius"] = radius
        shape = "circle"

    else
        error("Unrecognized shape: $shape")
    end

    # Construct the final JSON dictionary
    dict_obj = Dict(
        "shape" => shape,
        "parameters" => params,
        "plane" => plane_token,
        "coordinates" => coords
    )

    return JSON.json(dict_obj)  # Return as a JSON string
end

# -------------------------------------------------------------------------
# 2) PARSE THE RESULTING JSON → (shape, plane, parameters, coords)
# -------------------------------------------------------------------------
function parse_shape_json(json_str::String)
    data = JSON.parse(json_str)
    shape       = data["shape"]
    parameters  = data["parameters"]
    plane       = data["plane"]
    coordinates = data["coordinates"]  # [x, y, z]
    return shape, parameters, plane, coordinates
end

# -------------------------------------------------------------------------
# 3) GENERATE POLYGON IN LOCAL XY FOR EACH SHAPE
#    Return an array of (x,y) points
# -------------------------------------------------------------------------
function generate_polygon_local(shape::String, params::Dict{String,Any}; segments=64)
    if shape == "rectangle"
        w = params["width"]
        h = params["height"]
        # corners: (0,0), (w,0), (w,h), (0,h)
        return [
            (0.0, 0.0),
            (w,   0.0),
            (w,   h),
            (0.0, h)
        ]

    elseif shape == "circle"
        r = params["radius"]
        # approximate circle with segments
        pts = Vector{Tuple{Float64,Float64}}(undef, segments)
        for i in 1:segments
            θ = 2π * (i-1)/segments
            x = r*cos(θ)
            y = r*sin(θ)
            pts[i] = (x, y)
        end
        return pts

    elseif shape == "ellipse"
        major = params["major_radius"]
        minor = params["minor_radius"]
        # approximate ellipse with segments
        pts = Vector{Tuple{Float64,Float64}}(undef, segments)
        for i in 1:segments
            θ = 2π * (i-1)/segments
            x = major*cos(θ)
            y = minor*sin(θ)
            pts[i] = (x, y)
        end
        return pts

    elseif shape == "triangle"
        s1 = params["side1"]
        s2 = params["side2"]
        s3 = params["side3"]
        # We'll place side1 along the x-axis from (0,0) to (s1,0).
        # Then find the 3rd vertex using the law of cosines to get the angle.
        #   s3^2 = s1^2 + s2^2 - 2*s1*s2*cos(θ)
        # Solve for θ. We'll assume s1 is the base, and s2 is the next side.
        # Then (x3,y3) = (s2*cos(θ), s2*sin(θ)).
        #
        # Actually we need the angle between side1 and side2. By law of cosines on side3:
        #   s3^2 = s1^2 + s2^2 - 2*s1*s2*cos(θ)
        #   cos(θ) = (s1^2 + s2^2 - s3^2)/(2*s1*s2)
        #
        cosθ = (s1^2 + s2^2 - s3^2)/(2*s1*s2)
        if cosθ < -1.0 || cosθ > 1.0
            error("Invalid triangle sides: cannot compute an angle (check side lengths).")
        end
        θ = acos(cosθ)
        # The third vertex:
        x3 = s2*cos(θ)
        y3 = s2*sin(θ)
        return [
            (0.0, 0.0),
            (s1,  0.0),
            (x3,  y3)
        ]

    else
        error("Unsupported shape in generate_polygon_local: $shape")
    end
end

# -------------------------------------------------------------------------
# 4) PLANE TRANSFORMATION (local XY → specified plane)
#    We'll also handle plane strings like "XYConstructionPlane", "YZConstructionPlane",
#    "XZConstructionPlane", "ZXConstructionPlane", etc.
#    Each returns a 4x4 homogeneous rotation matrix.
# -------------------------------------------------------------------------
function plane_transformation(plane::String)
    # We'll interpret:
    #   XYConstructionPlane => normal +Z  (no rotation)
    #   XZConstructionPlane => normal +Y
    #   YZConstructionPlane => normal +X
    #   ZXConstructionPlane => normal +? 
    #
    # "ZX" is effectively the same as "XZ" but reversed. We'll define a custom rotation for it.
    I44 = Matrix{Float64}(I, 4, 4)

    plane_lower = lowercase(plane)
    if plane_lower == "xyconstructionplane"
        # normal +Z
        return I44

    elseif plane_lower == "xzconstructionplane"
        # normal +Y => rotate local +Z to +Y
        angle = -π/2
        R = [
            1.0           0.0           0.0           0.0
            0.0   cos(angle)  -sin(angle)   0.0
            0.0   sin(angle)   cos(angle)   0.0
            0.0           0.0           0.0           1.0
        ]
        return R

    elseif plane_lower == "yzconstructionplane"
        # normal +X => rotate local +Z to +X
        angle = π/2
        R = [
            cos(angle)   0.0   sin(angle)   0.0
            0.0          1.0   0.0          0.0
           -sin(angle)   0.0   cos(angle)   0.0
            0.0          0.0   0.0          1.0
        ]
        return R

    elseif plane_lower == "zxconstructionplane"
        # normal +? 
        # If "XZ" is normal +Y, "ZX" could be normal -Y or some variant.
        # We'll define "ZX" to rotate local +Z → -Y for demonstration:
        angle = π/2
        R = [
            1.0           0.0           0.0           0.0
            0.0   cos(angle)  -sin(angle)   0.0
            0.0   sin(angle)   cos(angle)   0.0
            0.0           0.0           0.0           1.0
        ]
        # This is somewhat arbitrary, but shows how you can handle an alternate plane.
        return R

    else
        error("Unrecognized plane: $plane")
    end
end

# -------------------------------------------------------------------------
# 5) TRANSFORM A 2D POINT → 3D, APPLY ROTATION + TRANSLATION
# -------------------------------------------------------------------------
function transform_point_3d(pt2::Tuple{Float64,Float64}, R::Matrix{Float64}, center::Tuple{Float64,Float64,Float64})
    (cx, cy, cz) = center
    # local 3D = (x, y, 0, 1)
    hv = [pt2[1], pt2[2], 0.0, 1.0]
    hv2 = R * hv
    # apply translation
    x = hv2[1] + cx
    y = hv2[2] + cy
    z = hv2[3] + cz
    return (x, y, z)
end

# -------------------------------------------------------------------------
# 6) TRIANGULATE A SINGLE CLOSED POLYGON (fan approach)
#    Returns a list of triangles, each triangle is a tuple of 3 points in 3D.
# -------------------------------------------------------------------------
function build_facets_from_polygon(points3D::Vector{Tuple{Float64,Float64,Float64}})
    n = length(points3D)
    if n < 3
        return NTuple{3,NTuple{3,Float64}}[]  # no facets
    end

    # "fan" from the first point
    p0 = points3D[1]
    facets = NTuple{3,NTuple{3,Float64}}[]
    for i in 2:(n-1)
        p1 = points3D[i]
        p2 = points3D[i+1]
        push!(facets, (p0, p1, p2))
    end
    return facets
end

# -------------------------------------------------------------------------
# 7) WRITE STL (ASCII) GIVEN A LIST OF TRIANGLES
#    Each triangle is (p0, p1, p2) with p0= (x,y,z).
# -------------------------------------------------------------------------
function write_stl(facets, filename::String)
    open(filename, "w") do io
        println(io, "solid shape")
        for (p0, p1, p2) in facets
            # compute normal via cross product
            nx, ny, nz = facet_normal(p0, p1, p2)
            println(io, "  facet normal $nx $ny $nz")
            println(io, "    outer loop")
            println(io, "      vertex $(p0[1]) $(p0[2]) $(p0[3])")
            println(io, "      vertex $(p1[1]) $(p1[2]) $(p1[3])")
            println(io, "      vertex $(p2[1]) $(p2[2]) $(p2[3])")
            println(io, "    endloop")
            println(io, "  endfacet")
        end
        println(io, "endsolid shape")
    end
    println("Wrote STL: $filename")
end

# Simple cross-product-based normal
function facet_normal(p0, p1, p2)
    v1 = (p1[1]-p0[1], p1[2]-p0[2], p1[3]-p0[3])
    v2 = (p2[1]-p0[1], p2[2]-p0[2], p2[3]-p0[3])
    nx = v1[2]*v2[3] - v1[3]*v2[2]
    ny = v1[3]*v2[1] - v1[1]*v2[3]
    nz = v1[1]*v2[2] - v1[2]*v2[1]
    len = sqrt(nx^2 + ny^2 + nz^2)
    if len < 1e-14
        return (0.0, 0.0, 0.0)
    end
    return (nx/len, ny/len, nz/len)
end

# -------------------------------------------------------------------------
# 8) WRITE DXF (minimal 3D polyline)
#    We'll write a single polyline of the shape boundary (closed loop).
# -------------------------------------------------------------------------
function write_dxf_2d(points2D::Vector{Tuple{Float64,Float64}}, filename::String; closed=true)
    open(filename, "w") do io
        # Start ENTITIES section
        println(io, "0")
        println(io, "SECTION")
        println(io, "2")
        println(io, "ENTITIES")

        # Start a 2D POLYLINE
        println(io, "0")
        println(io, "POLYLINE")
        println(io, "8")   # Group code for layer name
        println(io, "0")   # Layer name (just "0" here)
        println(io, "66")  # Indicates vertex data follow
        println(io, "1")
        println(io, "70")  # Flags
        if closed
            # 1 = closed 2D polyline
            println(io, "1")
        else
            # 0 = open 2D polyline
            println(io, "0")
        end

        # Output each vertex in 2D (no Z coordinate)
        for (x, y) in points2D
            println(io, "0")
            println(io, "VERTEX")
            println(io, "8")
            println(io, "0")    # Layer name
            println(io, "10")
            println(io, x)      # X
            println(io, "20")
            println(io, y)      # Y
        end

        # End the polyline sequence
        println(io, "0")
        println(io, "SEQEND")

        # Close ENTITIES and DXF file
        println(io, "0")
        println(io, "ENDSEC")
        println(io, "0")
        println(io, "EOF")
    end
    println("Wrote 2D DXF: $filename")
end

# -------------------------------------------------------------------------
# 9) DEMO: Putting it all together
# -------------------------------------------------------------------------
function demo()
    # We'll show how to handle the three examples from your prompt,
    # plus one circle example for completeness.
    
    inputs = [
        "rectangle 4 6 on YZConstructionPlane at (1,2,0)",
        "ellipse major 10 minor 5 on ZXConstructionPlane at (2,3,1)",
        "triangle 3 4 5 on XYConstructionPlane at (0,1,1)",
        "circle 5 on XZConstructionPlane at (1,1,1)"
    ]
    
    for (i, cmd) in pairs(inputs)
        println("--------------------------------------------------------------------------------")
        println("INPUT: $cmd")

        # 1) Convert command string -> JSON
        json_str = parse_input_to_json(cmd)
        println("JSON: $json_str")

        # 2) Parse JSON into shape info
        shape, params, plane, coords = parse_shape_json(json_str)

        # 3) Generate local polygon (in XY plane)
        poly_local = generate_polygon_local(shape, params; segments=32)

        # 4) Build plane transform, and transform points to 3D (for STL)
        R = plane_transformation(plane)
        poly_3d = [ transform_point_3d(pt, R, (coords[1], coords[2], coords[3])) 
                    for pt in poly_local ]

        # 5) Triangulate polygon for STL (3D)
        facets = build_facets_from_polygon(poly_3d)

        # 6) Write STL (3D) and DXF (2D)
        stl_file = "shape_$(i).stl"
        dxf_file = "shape_$(i).dxf"
        write_stl(facets, stl_file)

        # For DXF, we stay in 2D → just use the local XY polygon.
        # You can ignore the plane and coordinates entirely,
        # or optionally shift by coords[1], coords[2] if you want a simple 2D offset.
        # E.g.: poly_2d_shifted = [(x + coords[1], y + coords[2]) for (x, y) in poly_local]
        # For simplicity, we'll just use poly_local as-is, at origin:
        write_dxf_2d(poly_local, dxf_file; closed=true)
    end
end


# -------------------------------------------------------------------------
# Run the demo if this file is the main script.
# -------------------------------------------------------------------------

demo()
