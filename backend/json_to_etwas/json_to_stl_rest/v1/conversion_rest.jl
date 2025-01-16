using HTTP
using JSON
include("json_to_3D.jl")  # Include the STL utility functions

# Handler to process JSON input and generate STL
function handle_json_to_stl(req::HTTP.Request)
    try
        # Parse JSON data from the request body
        json_data = JSON.parse(String(req.body))
        shapes = json_data["shapes"]
        triangles = []

        # Process each shape
        for shape in shapes
            if shape["shape"] == "circle"
                radius = shape["parameters"]["radius"]
                height = shape["extrusion_amount"]
                append!(triangles, generate_circle_stl(shape["coordinates"], radius, height, 32))
            elseif shape["shape"] == "rectangle"
                width = shape["parameters"]["width"]
                height = shape["parameters"]["height"]
                depth = shape["extrusion_amount"]
                append!(triangles, generate_rectangle_stl(shape["coordinates"], width, height, depth))
            end
        end

        # Write the STL file
        stl_file = "output.stl"
        write_stl(stl_file, triangles)

        # Return the STL file as a response
        stl_content = read(stl_file, String)
        headers = [
            "Content-Disposition" => "attachment; filename=output.stl",
            "Content-Type" => "application/vnd.ms-pki.stl"
        ]
        return HTTP.Response(200, stl_content, headers)
    catch e
        # Handle errors and respond with an error message
        error_response = Dict("error" => "Invalid Request", "details" => string(e))
        return HTTP.Response(400, JSON.json(error_response), ["Content-Type" => "application/json"])
    end
end

# Create and start the HTTP server
function start_server()
    router = HTTP.Router()
    HTTP.register!(router, "POST", "/generate-stl", handle_json_to_stl)

    println("Starting server on http://127.0.0.1:8000")
    HTTP.serve(router, "127.0.0.1", 8000)
end

# Start the server
start_server()
