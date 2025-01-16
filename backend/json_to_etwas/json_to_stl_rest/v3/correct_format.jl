using HTTP
using JSON3
using LinearAlgebra

# Include the STL utility functions
include("json_to_3D.jl")

# Define the request handler function
function handle_request(req::HTTP.Request)
    method = String(req.method)
    path = String(req.target)

    # Debugging: Log the incoming request
    println("Request received: method=$method, path=$path")

    try
        if method == "POST" && path == "/generate_stl"
            # Parse the JSON payload
            data = JSON3.read(String(req.body))

            # Print the received JSON for debugging
            println("Received JSON: ", data)

            # Check if the "shapes" key exists
            if haskey(data, "shapes")
                shapes = data["shapes"]
                result_files = []

                for shape_entry in shapes
                    shape_type = get(shape_entry, "shape", "")
                    parameters = get(shape_entry, "parameters", Dict())
                    coordinates = get(shape_entry, "coordinates", [0.0, 0.0, 0.0])
                    extruded = get(shape_entry, "extruded", false)
                    extrusion_amount = get(shape_entry, "extrusion_amount", 0.0)
                    file_path = get(shape_entry, "file_path", "")

                    if file_path == ""
                        return HTTP.Response(400, JSON3.write(Dict("error" => "Missing 'file_path' for shape")))
                    end

                    if shape_type == "circle"
                        radius = get(parameters, "radius", 0.0)
                        height = extruded ? extrusion_amount : 0.0
                        center = coordinates
                        segments = 36  # Default segments for a circle

                        # Generate and save the circle STL
                        triangles = generate_circle_stl(center, radius, height, segments)
                        write_stl(file_path, triangles)
                        push!(result_files, file_path)

                    elseif shape_type == "rectangle"
                        width = get(parameters, "width", 0.0)
                        height = get(parameters, "height", 0.0)
                        depth = extruded ? extrusion_amount : 0.0
                        center = coordinates

                        # Generate and save the rectangle STL
                        triangles = generate_rectangle_stl(center, width, height, depth)
                        write_stl(file_path, triangles)
                        push!(result_files, file_path)

                    else
                        return HTTP.Response(400, JSON3.write(Dict("error" => "Invalid shape type: $shape_type")))
                    end
                end

                # Return success response with the generated file paths
                return HTTP.Response(200, JSON3.write(Dict("message" => "STL files generated", "files" => result_files)))
            else
                return HTTP.Response(400, JSON3.write(Dict("error" => "Missing 'shapes' key in JSON payload")))
            end
        else
            # Return a 404 response for unknown paths
            return HTTP.Response(404, JSON3.write(Dict("error" => "Endpoint not found")))
        end
    catch e
        # Return a 400 response for errors
        return HTTP.Response(400, JSON3.write(Dict("error" => string(e))))
    end
end

# Start the HTTP server
function start_server()
    println("Starting server on http://127.0.0.1:8081...")
    HTTP.serve("127.0.0.1", 8081) do req
        handle_request(req)
    end
end

start_server()
