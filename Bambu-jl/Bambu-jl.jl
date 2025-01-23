# bambu_client.jl
module BambuClient

using MQTT, JSON3, Random, Sockets, OpenSSL

include("models.jl")
include("CameraClient.jl")
include("WatchClient.jl")
include("ExecuteClient.jl")
include("FileClient.jl")

export BambuPrinter,
    start_camera_stream, stop_camera_stream, capture_camera_frame,
    start_watch_client, stop_watch_client,
    send_gcode, dump_info, start_print,
    get_files, download_file

mutable struct BambuPrinter
    camera_client::CameraClient
    watch_client::WatchClient
    execute_client::ExecuteClient
    file_client::FileClient

    function BambuPrinter(hostname::String, access_code::String, serial::String)
        new(
            CameraClient(hostname, access_code),
            WatchClient(hostname, access_code, serial),
            ExecuteClient(hostname, access_code, serial),
            FileClient(hostname, access_code, serial)
        )
    end
end


function Base.finalize(client::BambuPrinter)
    disconnect(client.execute_client)
end


function start_camera_stream(client::BambuPrinter, img_callback::Function)
    start_stream(client.camera_client, img_callback)
end

function stop_camera_stream(client::BambuPrinter)
    stop_stream(client.camera_client)
end

function capture_camera_frame(client::BambuPrinter)
    capture_frame(client.camera_client)
end


function start_watch_client(client::BambuPrinter;
                          message_callback::Union{Function,Nothing}=nothing,
                          on_connect_callback::Union{Function,Nothing}=nothing)
    start(client.watch_client, 
          message_callback=message_callback,
          on_connect_callback=on_connect_callback)
end

function stop_watch_client(client::BambuPrinter)
    stop(client.watch_client)
end

############# ExecuteClient Wrappers #############
function send_gcode(client::BambuPrinter, gcode::String)
    send_gcode(client.execute_client, gcode)
end

function dump_info(client::BambuPrinter)
    dump_info(client.execute_client)
end

function start_print(client::BambuPrinter, file::String)
    start_print(client.execute_client, file)
end

############# FileClient Wrappers #############
function get_files(client::BambuPrinter, path::String="/", extension::String=".3mf")
    get_files(client.file_client, path, extension)
end

function download_file(client::BambuPrinter; 
                      local_path::String,
                      remote_path::String="/timelapse",
                      extension::String="",
                      verbose::Bool=true)
    download_file(client.file_client, remote_path, local_path, verbose)
end

end # module
