using MQTT, JSON3, Random

export ExecuteClient, disconnect, send_command, send_gcode, dump_info, start_print

mutable struct ExecuteClient
    hostname::String
    access_code::String
    serial::String
    client::MQTT.Client

    function ExecuteClient(hostname, access_code, serial)
        ssl_config = SSLConfig(
            verify_peer=false,
            verify_server=false,
            check_hostname=false,
            protocol_version=MQTT.TLSv1_2
        )
        client = MQTT.Client(
            hostname=hostname,
            port=8883,
            client_id="bblp_$(randstring(8))",
            keep_alive=60,
            ssl_config=ssl_config
        )
        client.username = "bblp"
        client.password = access_code
        connect(client)
        new(hostname, access_code, serial, client)
    end
end

function disconnect(client::ExecuteClient)
    MQTT.disconnect(client.client)
end

function send_command(client::ExecuteClient, payload)
    topic = "device/$(client.serial)/request"
    MQTT.start_loop(client.client)
    try
        MQTT.publish(client.client, topic, payload, qos=1)
    finally
        MQTT.stop_loop(client.client)
    end
end

function send_gcode(client::ExecuteClient, gcode::String)
    payload = Dict(
        "print" => Dict(
            "command" => "gcode_line",
            "sequence_id" => 2006,
            "param" => "$(gcode) \n"
        ),
        "user_id" => "1234567890"
    )
    send_command(client, JSON3.write(payload))
end

function dump_info(client::ExecuteClient)
    payload = Dict(
        "pushing" => Dict(
            "sequence_id" => 1,
            "command" => "pushall"
        ),
        "user_id" => "1234567890"
    )
    send_command(client, JSON3.write(payload))
end

function start_print(client::ExecuteClient, file::String)
    payload = Dict(
        "print" => Dict(
            "sequence_id" => 13,
            "command" => "project_file",
            "param" => "Metadata/plate_1.gcode",
            "subtask_name" => file,
            "url" => "ftp://$file",
            "bed_type" => "auto",
            "timelapse" => false,
            "bed_leveling" => true,
            "flow_cali" => false,
            "vibration_cali" => true,
            "layer_inspect" => false,
            "use_ams" => false,
            "profile_id" => "0",
            "project_id" => "0",
            "subtask_id" => "0",
            "task_id" => "0"
        )
    )
    send_command(client, JSON3.write(payload))
end
