using HTTP
using JSON3
using LinearAlgebra
using Dates

# Import utilities
include("dxf_utils.jl")
include("stl_utils.jl")

const OUTPUT_DIR = "output"
const SERVER_PORT = 8080
const SERVER_HOST = "127.0.0.1"
mkpath(OUTPUT_DIR)

function get_cors_headers()
    [
        "Access-Control-Allow-Origin" => "*",
        "Access-Control-Allow-Methods" => "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers" => "*",
        "Access-Control-Max-Age" => "86400",
        "Access-Control-Allow-Credentials" => "true"
    ]
end

function handle_request(req::HTTP.Request)
    method = uppercase(String(req.method))
    path = String(req.target)
    println("$(now()): Received $method request at $path")

    if method == "OPTIONS"
        headers = get_cors_headers()
        return HTTP.Response(200, headers)
    end

    try
        if method == "POST"
            # Parse JSON payload
            data = JSON3.read(String(req.body))
            shapes = if haskey(data, "shapes")
                data["shapes"]
            else
                [data]
            end
            
            timestamp = Dates.format(now(), "yyyymmdd_HHMMSS")
            headers = get_cors_headers()

            if path == "/generate_dxf"
                filename = "shapes_$timestamp.dxf"
                filepath = joinpath(OUTPUT_DIR, filename)
                write_dxf(filepath, shapes)
                
                content = read(filepath)
                push!(headers, "Content-Disposition" => "attachment; filename=\"$filename\"")
                push!(headers, "Content-Type" => "application/octet-stream")
                return HTTP.Response(200, headers, body=content)

            elseif path == "/generate_stl"
                filename = "shapes_$timestamp.stl"
                filepath = joinpath(OUTPUT_DIR, filename)
                convert_shapes_to_stl(shapes, filepath)
                
                content = read(filepath)
                push!(headers, "Content-Disposition" => "attachment; filename=\"$filename\"")
                push!(headers, "Content-Type" => "application/octet-stream")
                return HTTP.Response(200, headers, body=content)

            elseif path == "/generate_both"
                # Generate both DXF and STL files
                dxf_filename = "shapes_$timestamp.dxf"
                stl_filename = "shapes_$timestamp.stl"
                dxf_filepath = joinpath(OUTPUT_DIR, dxf_filename)
                stl_filepath = joinpath(OUTPUT_DIR, stl_filename)
                
                write_dxf(dxf_filepath, shapes)
                convert_shapes_to_stl(shapes, stl_filepath)
                
                # Create ZIP file containing both
                zip_filename = "shapes_$timestamp.zip"
                zip_filepath = joinpath(OUTPUT_DIR, zip_filename)
                
                # Use system zip command (you might want to use a proper ZIP library)
                run(`zip -j $zip_filepath $dxf_filepath $stl_filepath`)
                
                content = read(zip_filepath)
                push!(headers, "Content-Disposition" => "attachment; filename=\"$zip_filename\"")
                push!(headers, "Content-Type" => "application/zip")
                return HTTP.Response(200, headers, body=content)
            end
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

println("Server running at http://$SERVER_HOST:$SERVER_PORT")
println("Endpoints available:")
println("  POST /generate_dxf  - Generate DXF file")
println("  POST /generate_stl  - Generate STL file")
println("  POST /generate_both - Generate both DXF and STL files (returns ZIP)")
readline() # Keep server running
