using JSON3

mutable struct Upload
    status::Union{String, Nothing}
    progress::Union{Int, Nothing}
    message::Union{String, Nothing}
    
    Upload() = new(nothing, nothing, nothing)
end

mutable struct Online
    ahb::Union{Bool, Nothing}
    rfid::Union{Bool, Nothing}
    version::Union{Int, Nothing}
    
    Online() = new(nothing, nothing, nothing)
end

mutable struct VTTray
    id::Union{String, Nothing}
    tag_uid::Union{String, Nothing}
    tray_id_name::Union{String, Nothing}
    tray_info_idx::Union{String, Nothing}
    tray_type::Union{String, Nothing}
    tray_sub_brands::Union{String, Nothing}
    tray_color::Union{String, Nothing}
    tray_weight::Union{String, Nothing}
    tray_diameter::Union{String, Nothing}
    tray_temp::Union{String, Nothing}
    tray_time::Union{String, Nothing}
    bed_temp_type::Union{String, Nothing}
    bed_temp::Union{String, Nothing}
    nozzle_temp_max::Union{String, Nothing}
    nozzle_temp_min::Union{String, Nothing}
    xcam_info::Union{String, Nothing}
    tray_uuid::Union{String, Nothing}
    remain::Union{Int, Nothing}
    k::Union{Float64, Nothing}
    n::Union{Int, Nothing}
    cali_idx::Union{Int, Nothing}
    
    VTTray() = new(fill(nothing, 21)...)
end

mutable struct AMSEntry
    humidity::Union{String, Nothing}
    id::Union{String, Nothing}
    temp::Union{String, Nothing}
    tray::Union{Vector{VTTray}, Nothing}
    
    AMSEntry() = new(nothing, nothing, nothing, nothing)
end

mutable struct AMS
    ams::Union{Vector{AMSEntry}, Nothing}
    ams_exist_bits::Union{String, Nothing}
    tray_exist_bits::Union{String, Nothing}
    tray_is_bbl_bits::Union{String, Nothing}
    tray_tar::Union{String, Nothing}
    tray_now::Union{String, Nothing}
    tray_pre::Union{String, Nothing}
    tray_read_done_bits::Union{String, Nothing}
    tray_reading_bits::Union{String, Nothing}
    version::Union{Int, Nothing}
    insert_flag::Union{Bool, Nothing}
    power_on_flag::Union{Bool, Nothing}
    
    AMS() = new(fill(nothing, 12)...)
end

mutable struct IPCam
    ipcam_dev::Union{String, Nothing}
    ipcam_record::Union{String, Nothing}
    timelapse::Union{String, Nothing}
    resolution::Union{String, Nothing}
    tutk_server::Union{String, Nothing}
    mode_bits::Union{Int, Nothing}
    
    IPCam() = new(fill(nothing, 6)...)
end

mutable struct LightsReport
    node::Union{String, Nothing}
    mode::Union{String, Nothing}
    
    LightsReport() = new(nothing, nothing)
end

mutable struct UpgradeState
    sequence_id::Union{Int, Nothing}
    progress::Union{String, Nothing}
    status::Union{String, Nothing}
    consistency_request::Union{Bool, Nothing}
    dis_state::Union{Int, Nothing}
    err_code::Union{Int, Nothing}
    force_upgrade::Union{Bool, Nothing}
    message::Union{String, Nothing}
    module_::Union{String, Nothing}  # Note: module is keyword in Julia
    new_version_state::Union{Int, Nothing}
    new_ver_list::Union{Vector{Any}, Nothing}
    cur_state_code::Union{Int, Nothing}
    
    UpgradeState() = new(fill(nothing, 12)...)
end

mutable struct PrinterStatus
    upload::Union{Upload, Nothing}
    nozzle_temper::Union{Float64, Nothing}
    nozzle_target_temper::Union{Float64, Nothing}
    bed_temper::Union{Float64, Nothing}
    bed_target_temper::Union{Float64, Nothing}
    chamber_temper::Union{Float64, Nothing}
    mc_print_stage::Union{String, Nothing}
    heatbreak_fan_speed::Union{String, Nothing}
    cooling_fan_speed::Union{String, Nothing}
    big_fan1_speed::Union{String, Nothing}
    big_fan2_speed::Union{String, Nothing}
    mc_percent::Union{Int, Nothing}
    mc_remaining_time::Union{Int, Nothing}
    ams_status::Union{Int, Nothing}
    ams_rfid_status::Union{Int, Nothing}
    hw_switch_state::Union{Int, Nothing}
    spd_mag::Union{Int, Nothing}
    spd_lvl::Union{Int, Nothing}
    print_error::Union{Int, Nothing}
    lifecycle::Union{String, Nothing}
    wifi_signal::Union{String, Nothing}
    gcode_state::Union{String, Nothing}
    gcode_file_prepare_percent::Union{String, Nothing}
    queue_number::Union{Int, Nothing}
    queue_total::Union{Int, Nothing}
    queue_est::Union{Int, Nothing}
    queue_sts::Union{Int, Nothing}
    project_id::Union{String, Nothing}
    profile_id::Union{String, Nothing}
    task_id::Union{String, Nothing}
    subtask_id::Union{String, Nothing}
    subtask_name::Union{String, Nothing}
    gcode_file::Union{String, Nothing}
    stg::Union{Vector{Any}, Nothing}
    stg_cur::Union{Int, Nothing}
    print_type::Union{String, Nothing}
    home_flag::Union{Int, Nothing}
    mc_print_line_number::Union{String, Nothing}
    mc_print_sub_stage::Union{Int, Nothing}
    sdcard::Union{Bool, Nothing}
    force_upgrade::Union{Bool, Nothing}
    mess_production_state::Union{String, Nothing}
    layer_num::Union{Int, Nothing}
    total_layer_num::Union{Int, Nothing}
    s_obj::Union{Vector{Any}, Nothing}
    fan_gear::Union{Int, Nothing}
    hms::Union{Vector{Any}, Nothing}
    online::Union{Online, Nothing}
    ams::Union{AMS, Nothing}
    ipcam::Union{IPCam, Nothing}
    vt_tray::Union{VTTray, Nothing}
    lights_report::Union{Vector{LightsReport}, Nothing}
    upgrade_state::Union{UpgradeState, Nothing}
    command::Union{String, Nothing}
    msg::Union{Int, Nothing}
    sequence_id::Union{String, Nothing}
end

# Constructor for PrinterStatus
function PrinterStatus(data::Dict)
    ps = PrinterStatus([nothing for _ in 1:55]...)
    
    # Helper function to safely get nested dict
    function safe_get(dict, key, T)
        haskey(dict, key) ? convert(T, dict[key]) : nothing
    end
    
    # Handle nested structures
    if haskey(data, "upload")
        ps.upload = Upload()
        for (k, v) in data["upload"]
            setfield!(ps.upload, Symbol(k), v)
        end
    end
    
    if haskey(data, "online")
        ps.online = Online()
        for (k, v) in data["online"]
            setfield!(ps.online, Symbol(k), v)
        end
    end
    
    if haskey(data, "ams")
        ps.ams = AMS()
        for (k, v) in data["ams"]
            setfield!(ps.ams, Symbol(k), v)
        end
    end
    
    if haskey(data, "ipcam")
        ps.ipcam = IPCam()
        for (k, v) in data["ipcam"]
            setfield!(ps.ipcam, Symbol(k), v)
        end
    end
    
    if haskey(data, "vt_tray")
        ps.vt_tray = VTTray()
        for (k, v) in data["vt_tray"]
            setfield!(ps.vt_tray, Symbol(k), v)
        end
    end
    
    if haskey(data, "lights_report")
        ps.lights_report = [LightsReport() for _ in 1:length(data["lights_report"])]
        for (i, lr) in enumerate(data["lights_report"])
            for (k, v) in lr
                setfield!(ps.lights_report[i], Symbol(k), v)
            end
        end
    end
    
    if haskey(data, "upgrade_state")
        ps.upgrade_state = UpgradeState()
        for (k, v) in data["upgrade_state"]
            k = k == "module" ? "module_" : k  # Handle Julia keyword
            setfield!(ps.upgrade_state, Symbol(k), v)
        end
    end
    
    # Handle simple fields
    simple_fields = [
        :nozzle_temper, :nozzle_target_temper, :bed_temper, :bed_target_temper,
        :chamber_temper, :mc_print_stage, :heatbreak_fan_speed, :cooling_fan_speed,
        :big_fan1_speed, :big_fan2_speed, :mc_percent, :mc_remaining_time,
        :ams_status, :ams_rfid_status, :hw_switch_state, :spd_mag, :spd_lvl,
        :print_error, :lifecycle, :wifi_signal, :gcode_state,
        :gcode_file_prepare_percent, :queue_number, :queue_total, :queue_est,
        :queue_sts, :project_id, :profile_id, :task_id, :subtask_id, :subtask_name,
        :gcode_file, :stg, :stg_cur, :print_type, :home_flag, :mc_print_line_number,
        :mc_print_sub_stage, :sdcard, :force_upgrade, :mess_production_state,
        :layer_num, :total_layer_num, :s_obj, :fan_gear, :hms, :command, :msg,
        :sequence_id
    ]
    
    for field in simple_fields
        if haskey(data, String(field))
            setfield!(ps, field, data[String(field)])
        end
    end
    
    return ps
end
