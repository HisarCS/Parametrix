using HTTP
using JSON3
using LinearAlgebra

# Include the STL utility functions
include("json_to_3D.jl")

# Define a constant for the unified STL file path
const UNIFIED_STL_PATH = "unified_shapes.stl"

# Define the request handler function
function handle_request(req::HTTP.Request)
    method = String(req.method)
    path = String(req.target)

    # Debugging: Log the incoming request
    println("Request received: method=$method, path=$path")

    # Define CORS headers
    cors_headers = [
        "Access-Control-Allow-Origin" => "*",
        "Access-Control-Allow-Methods" => "POST, OPTIONS",
        "Access-Control-Allow-Headers" => "Content-Type"
    ]

    try
        # Handle CORS preflight (OPTIONS) requests
        if method == "OPTIONS"
            return HTTP.Response(
                200,
                cors_headers,
                body=""
            )
        end

        if method == "POST" && path == "/generate_stl"
            # Parse the JSON payload
            data = JSON3.read(String(req.body))

            # Print the received JSON for debugging
            println("Received JSON: ", data)

            # Check if the "shapes" key exists
            if haskey(data, "shapes")
                shapes = data["shapes"]
                all_triangles = []

                for shape_entry in shapes
                    shape_type = get(shape_entry, "shape", "")
                    parameters = get(shape_entry, "parameters", Dict())
                    coordinates = get(shape_entry, "coordinates", [0.0, 0.0, 0.0])
                    extruded = get(shape_entry, "extruded", false)
                    extrusion_amount = get(shape_entry, "extrusion_amount", 0.0)

                    if shape_type == "circle"
                        radius = get(parameters, "radius", 0.0)
                        height = extruded ? extrusion_amount : 0.0
                        center = coordinates
                        segments = 36  # Default segments for a circle

                        # Generate circle triangles
                        triangles = generate_circle_stl(center, radius, height, segments)
                        append!(all_triangles, triangles)

                    elseif shape_type == "rectangle"
                        width = get(parameters, "width", 0.0)
                        height = get(parameters, "height", 0.0)
                        depth = extruded ? extrusion_amount : 0.0
                        center = coordinates

                        # Generate rectangle triangles
                        triangles = generate_rectangle_stl(center, width, height, depth)
                        append!(all_triangles, triangles)

                    else
                        return HTTP.Response(
                            400,
                            cors_headers,
                            body=JSON3.write(Dict("error" => "Invalid shape type: $shape_type"))
                        )
                    end
                end

                # Save all combined triangles to the predefined STL file path
                write_stl(UNIFIED_STL_PATH, all_triangles)

                # Return success response with the unified file path
                return HTTP.Response(
                    200,
                    cors_headers,
                    body=JSON3.write(Dict(
                        "message" => "Unified STL file generated",
                        "file_path" => UNIFIED_STL_PATH
                    ))
                )
            else
                return HTTP.Response(
                    400,
                    cors_headers,
                    body=JSON3.write(Dict("error" => "Missing 'shapes' key in JSON payload"))
                )
            end
        else
            # Return a 404 response for unknown paths
            return HTTP.Response(
                404,
                cors_headers,
                body=JSON3.write(Dict("error" => "Endpoint not found"))
            )
        end
    catch e
        # Return a 400 response for errors
        return HTTP.Response(
            400,
            cors_headers,
            body=JSON3.write(Dict("error" => string(e)))
        )
    end
end

# Start the HTTP server
function start_server()
    println("Starting server on http://127.0.0.1:8080...")
    HTTP.serve("127.0.0.1", 8080) do req
        handle_request(req)
    end
end

start_server()
