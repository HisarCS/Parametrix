using HTTP
using JSON

# Assuming the provided functions (like parse_input_to_json, etc.) are defined in another part of your code or included here.

function handle_request(req::HTTP.Request)
    if req.method != HTTP.POST
        return HTTP.Response(405, "Method Not Allowed")
    end

    try
        body = JSON.parse(String(req.body))
        command = get(body, "command", "")

        if command == ""
            return HTTP.Response(400, "Bad Request: Missing 'command' in request body")
        end

        # Process the command to generate shape data
        shape_json = parse_input_to_json(command)
        shape, params, plane, coords = parse_shape_json(shape_json)

        # For non-production, just simulate the response
        response_body = JSON.json(Dict(
            "shape" => shape,
            "params" => params,
            "plane" => plane,
            "coords" => coords
        ))

        return HTTP.Response(200, MIME("application/json"), response_body)

    catch e
        return HTTP.Response(400, "Invalid input or processing error: $e")
    end
end

function start_server()
    router = HTTP.Router()
    HTTP.@register(router, "POST", "/api/shape", handle_request)
    HTTP.serve(router, "0.0.0.0", 8080)
    println("Server is running at http://0.0.0.0:8080")
end

# Call this function to start the server
start_server()
