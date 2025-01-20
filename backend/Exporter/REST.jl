using HTTP
using JSON3
using LinearAlgebra
using Dates

# Import DXF utilities
include("dxf_utils.jl")

const OUTPUT_DIR = "output"
const SERVER_PORT = 8080
const SERVER_HOST = "127.0.0.1"

mkpath(OUTPUT_DIR)

# Updated CORS headers
function get_cors_headers()
    [
        "Access-Control-Allow-Origin" => "*",
        "Access-Control-Allow-Methods" => "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers" => "*",  # Allow all headers
        "Access-Control-Max-Age" => "86400",
        "Access-Control-Allow-Credentials" => "true"
    ]
end

# Updated request handler with better OPTIONS handling
function handle_request(req::HTTP.Request)
    method = uppercase(String(req.method))
    path = String(req.target)
    
    println("$(now()): Received $method request at $path")

    # Enhanced CORS preflight handling
    if method == "OPTIONS"
        headers = get_cors_headers()
        return HTTP.Response(200, headers)
    end

    try
        if method == "POST" && path == "/generate_dxf"
            # Parse JSON payload
            data = JSON3.read(String(req.body))
            
            # Process shapes
            shapes = if haskey(data, "shapes")
                data["shapes"]
            else
                [data]
            end

            # Generate filename
            filename = "shapes_$(Dates.format(now(), "yyyymmdd_HHMMSS")).dxf"
            filepath = joinpath(OUTPUT_DIR, filename)
            
            # Generate DXF
            write_dxf(filepath, shapes)
            
            # Return file
            content = read(filepath)
            headers = get_cors_headers()
            push!(headers, "Content-Disposition" => "attachment; filename=\"$filename\"")
            push!(headers, "Content-Type" => "application/octet-stream")
            
            return HTTP.Response(200, headers, body=content)
        end
    catch e
        println("Error: ", e)
        headers = get_cors_headers()
        return HTTP.Response(500, headers, 
            body=JSON3.write(Dict("error" => string(e))))
    end

    # Default response for unknown endpoints
    return HTTP.Response(404, get_cors_headers(), 
        body=JSON3.write(Dict("error" => "Not found")))
end

# Start server
@async begin
    try
        HTTP.serve(handle_request, SERVER_HOST, SERVER_PORT)
    catch e
        println("Server error: ", e)
    end
end

println("Server running on http://$SERVER_HOST:$SERVER_PORT")
readline() # Keep server running
