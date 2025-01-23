# watch_client.jl
include("models.jl")
using MQTT, JSON3, Random

mutable struct WatchClient
   hostname::String
   access_code::String
   serial::String
   client::MQTT.Client
   values::Dict{String,Any}
   printer_status::Union{PrinterStatus,Nothing} 
   message_callback::Union{Function,Nothing}
   on_connect_callback::Union{Function,Nothing}

   function WatchClient(hostname::String, access_code::String, serial::String)
       client = setup_mqtt_client(hostname, access_code)
       new(hostname, access_code, serial, client, Dict(), nothing, nothing, nothing)
   end
end

function setup_mqtt_client(hostname::String, access_code::String)
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

   return client
end

function on_connect(client::WatchClient)
   topic = "device/$(client.serial)/report"
   MQTT.subscribe!(client.client, topic)
   
   if client.on_connect_callback !== nothing
       client.on_connect_callback()
   end
end

function on_message(client::WatchClient, topic::String, payload::Vector{UInt8})
   try
       doc = JSON3.read(String(payload), Dict)
       if isempty(doc)
           return
       end
       
       merge!(client.values, get(doc, "print", Dict()))
       client.printer_status = PrinterStatus(client.values)
       
       if client.message_callback !== nothing
           client.message_callback(client.printer_status)
       end
   catch e
       if !(e isa KeyError)
           @warn "Error processing message" exception=e
       end
   end
end

function start(client::WatchClient;
              message_callback::Union{Function,Nothing}=nothing,
              on_connect_callback::Union{Function,Nothing}=nothing)
   client.message_callback = message_callback
   client.on_connect_callback = on_connect_callback
   
   MQTT.set_callback!(client.client) do topic, payload
       on_message(client, topic, payload)
   end
   
   connect(client.client)
   on_connect(client)
   MQTT.start_loop(client.client)
end

function stop(client::WatchClient)
   MQTT.stop_loop(client.client)
   MQTT.disconnect(client.client)
end
