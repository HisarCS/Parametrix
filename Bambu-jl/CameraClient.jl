using Sockets, OpenSSL, Dates, Threads

mutable struct CameraClient
    hostname::String
    port::Int
    username::String
    auth_packet::Vector{UInt8}
    streaming::Bool
    stream_thread::Union{Task, Nothing}

    function CameraClient(hostname::String, access_code::String, port::Int=6000)
        username = "bblp"
        auth_packet = create_auth_packet(username, access_code)
        new(hostname, port, username, auth_packet, false, nothing)
    end
end

function create_auth_packet(username::String, access_code::String)
    auth_data = Vector{UInt8}()
    
    # Pack initial values
    append!(auth_data, reinterpret(UInt8, [UInt32(0x40)]))     # '@'\0\0\0
    append!(auth_data, reinterpret(UInt8, [UInt32(0x3000)]))   # \0'0'\0\0
    append!(auth_data, reinterpret(UInt8, [UInt32(0)]))        # \0\0\0\0
    append!(auth_data, reinterpret(UInt8, [UInt32(0)]))        # \0\0\0\0
    
    # Pack username with padding
    username_bytes = Vector{UInt8}(username)
    append!(auth_data, username_bytes)
    append!(auth_data, zeros(UInt8, 32 - length(username_bytes)))
    
    # Pack access_code with padding
    access_code_bytes = Vector{UInt8}(access_code)
    append!(auth_data, access_code_bytes)
    append!(auth_data, zeros(UInt8, 32 - length(access_code_bytes)))
    
    return auth_data
end

function find_jpeg(buf::Vector{UInt8}, start_marker::Vector{UInt8}, end_marker::Vector{UInt8})
    start_idx = findfirst(start_marker, buf)
    if start_idx !== nothing
        end_idx = findnext(end_marker, buf, first(start_idx) + length(start_marker))
        if end_idx !== nothing
            end_pos = last(end_idx) + length(end_marker)
            return buf[first(start_idx):end_pos], buf[end_pos+1:end]
        end
    end
    return nothing, buf
end

function capture_frame(client::CameraClient)
    ctx = SSLContext(SSLv23_method())
    set_options(ctx, SSL_OP_NO_SSLv2 | SSL_OP_NO_SSLv3)
    
    jpeg_start = UInt8[0xff, 0xd8, 0xff, 0xe0]
    jpeg_end = UInt8[0xff, 0xd9]
    read_chunk_size = 4096
    
    sock = connect(client.hostname, client.port)
    ssl_sock = SSLSocket(ctx)
    set_socket(ssl_sock, sock)
    set_tlsext_host_name(ssl_sock, client.hostname)
    
    try
        do_handshake(ssl_sock)
        write(ssl_sock, client.auth_packet)
        
        buf = Vector{UInt8}()
        while true
            chunk = read(ssl_sock, read_chunk_size)
            isempty(chunk) && break
            append!(buf, chunk)
            
            img, buf = find_jpeg(buf, jpeg_start, jpeg_end)
            if img !== nothing
                return img
            end
        end
    finally
        close(ssl_sock)
        close(sock)
    end
    return nothing
end

function capture_stream(client::CameraClient, img_callback::Function)
    ctx = SSLContext(SSLv23_method())
    set_options(ctx, SSL_OP_NO_SSLv2 | SSL_OP_NO_SSLv3)
    
    jpeg_start = UInt8[0xff, 0xd8, 0xff, 0xe0]
    jpeg_end = UInt8[0xff, 0xd9]
    read_chunk_size = 4096
    
    sock = connect(client.hostname, client.port)
    ssl_sock = SSLSocket(ctx)
    set_socket(ssl_sock, sock)
    set_tlsext_host_name(ssl_sock, client.hostname)
    
    try
        do_handshake(ssl_sock)
        write(ssl_sock, client.auth_packet)
        
        buf = Vector{UInt8}()
        while client.streaming
            chunk = read(ssl_sock, read_chunk_size)
            isempty(chunk) && break
            append!(buf, chunk)
            
            img, buf = find_jpeg(buf, jpeg_start, jpeg_end)
            if img !== nothing
                img_callback(img)
            end
        end
    finally
        close(ssl_sock)
        close(sock)
    end
end

function start_stream(client::CameraClient, img_callback::Function)
    if client.streaming
        println("Stream already running.")
        return
    end
    
    client.streaming = true
    client.stream_thread = @task capture_stream(client, img_callback)
    schedule(client.stream_thread)
end

function stop_stream(client::CameraClient)
    if !client.streaming
        println("Stream is not running.")
        return
    end
    
    client.streaming = false
    wait(client.stream_thread)
    client.stream_thread = nothing
end
