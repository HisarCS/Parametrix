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
            # Parse the JSON payload exactly as provided
            data = JSON3.read(String(req.body))

            # Print the received JSON for confirmation
            println("Received JSON: ", data)

            # Check the type of STL to generate
            stl_type = get(data, "type", "")

            if stl_type == "circle"
                # Pass all JSON data directly to the circle generator
                center = data["center"]
                radius = data["radius"]
                height = data["height"]
                segments = data["segments"]
                file_path = data["file_path"]

                # Generate and save the circle STL
                triangles = generate_circle_stl(center, radius, height, segments)
                write_stl(file_path, triangles)

                return HTTP.Response(200, JSON3.write(Dict("message" => "Circle STL generated", "file_path" => file_path)))

            elseif stl_type == "rectangle"
                # Pass all JSON data directly to the rectangle generator
                center = data["center"]
                width = data["width"]
                height = data["height"]
                depth = data["depth"]
                file_path = data["file_path"]

                # Generate and save the rectangle STL
                triangles = generate_rectangle_stl(center, width, height, depth)
                write_stl(file_path, triangles)

                return HTTP.Response(200, JSON3.write(Dict("message" => "Rectangle STL generated", "file_path" => file_path)))
            else
                return HTTP.Response(400, JSON3.write(Dict("error" => "Invalid type. Use 'circle' or 'rectangle'.")))
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
