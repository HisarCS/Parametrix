using Downloads

"""
FileClient for handling FTP operations with a remote printer.
"""
mutable struct FileClient
    hostname::String
    access_code::String
    serial::String

    FileClient(hostname::String, access_code::String, serial::String) = new(hostname, access_code, serial)
end

"""
    get_files(client::FileClient, directory="/", extension=".3mf")

Retrieve a list of files with the specified extension from the given directory.
"""
function get_files(client::FileClient, directory::String="/", extension::String=".3mf")
    # Create the curl command
    command = `curl --ftp-pasv --insecure ftps://$(client.hostname)$(directory) --user bblp:$(client.access_code)`
    
    # Run the command and capture output
    try
        output = read(command, String)
        
        # Filter and process the output
        filtered_files = String[]
        for line in split(output, '\n')
            if !isempty(strip(line))
                # Split the line by whitespace and take the last part as filename
                parts = split(line, r"\s+"; limit=9)
                filename = parts[end]
                if endswith(filename, extension)
                    push!(filtered_files, filename)
                end
            end
        end
        return filtered_files
    catch e
        @warn "Error getting files: $e"
        return String[]
    end
end

"""
    download_file(client::FileClient, remote_path::String, local_path::String, verbose::Bool=true)

Download a file from the remote path to the local path.
"""
function download_file(client::FileClient, remote_path::String, local_path::String, verbose::Bool=true)
    # Create directory if it doesn't exist
    mkpath(local_path)
    
    # Construct local file path
    local_file_path = joinpath(local_path, basename(remote_path))
    
    # Construct the curl command
    command = `curl -o $local_file_path --ftp-pasv --insecure ftps://$(client.hostname)$(remote_path) --user bblp:$(client.access_code)`
    
    try
        if verbose
            # Run command with visible output
            run(command)
        else
            # Run command silently
            read(command, String)
        end
        return true
    catch e
        if verbose
            println(stderr, "Error downloading file: $e")
        end
        return false
    end
end
