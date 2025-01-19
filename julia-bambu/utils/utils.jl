using JSON

mutable struct Upload
    status::Union{String, Nothing}
    progress::Union{Int, Nothing}
    message::Union{String, Nothing}

    Upload(; status=nothing, progress=nothing, message=nothing) = new(status, progress, message)
end

mutable struct Online
    ahb::Union{Bool, Nothing}
    rfid::Union{Bool, Nothing}
    version::Union{Int, Nothing}

    Online(; ahb=nothing, rfid=nothing, version=nothing) = new(ahb, rfid, version)
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

    VTTray(; kwargs...) = new(kwargs...)
end

mutable struct AMSEntry
    humidity::Union{String, Nothing}
    id::Union{String, Nothing}
    temp::Union{String, Nothing}
    tray::Union{Vector{VTTray}, Nothing}

    AMSEntry(; kwargs...) = new(kwargs...)
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

    AMS(; kwargs...) = new(kwargs...)
end

mutable struct IPCam
    ipcam_dev::Union{String, Nothing}
    ipcam_record::Union{String, Nothing}
    timelapse::Union{String, Nothing}
    resolution::Union{String, Nothing}
    tutk_server::Union{String, Nothing}
    mode_bits::Union{Int, Nothing}

    IPCam(; kwargs...) = new(kwargs...)
end

mutable struct LightsReport
    node::Union{String, Nothing}
    mode::Union{String, Nothing}

    LightsReport(; kwargs...) = new(kwargs...)
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
    module::Union{String, Nothing}
    new_version_state::Union{Int, Nothing}
    new_ver_list::Union{Vector{Any}, Nothing}
    cur_state_code::Union{Int, Nothing}

    UpgradeState(; kwargs...) = new(kwargs...)
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
    stg::Vector{Any}
    stg_cur::Union{Int, Nothing}
    print_type::Union{String, Nothing}
    home_flag::Union{Int, Nothing}
    mc_print_line_number::Union{String, Nothing}
    mc_print_sub_stage::Union{Int, Nothing}
    sdcard::Bool
    force_upgrade::Bool
    mess_production_state::Union{String, Nothing}
    layer_num::Union{Int, Nothing}
    total_layer_num::Union{Int, Nothing}
    s_obj::Vector{Any}
    fan_gear::Union{Int, Nothing}
    hms::Vector{Any}
    online::Union{Online, Nothing}
    ams::Union{AMS, Nothing}
    ipcam::Union{IPCam, Nothing}
    vt_tray::Union{VTTray, Nothing}
    lights_report::Vector{LightsReport}
    upgrade_state::Union{UpgradeState, Nothing}
    command::Union{String, Nothing}
    msg::Union{Int, Nothing}
    sequence_id::Union{String, Nothing}

    function PrinterStatus(; kwargs...)
        new(
            get(kwargs, :upload, nothing),
            get(kwargs, :nozzle_temper, nothing),
            get(kwargs, :nozzle_target_temper, nothing),
            get(kwargs, :bed_temper, nothing),
            get(kwargs, :bed_target_temper, nothing),
            get(kwargs, :chamber_temper, nothing),
            get(kwargs, :mc_print_stage, nothing),
            get(kwargs, :heatbreak_fan_speed, nothing),
            get(kwargs, :cooling_fan_speed, nothing),
            get(kwargs, :big_fan1_speed, nothing),
            get(kwargs, :big_fan2_speed, nothing),
            get(kwargs, :mc_percent, nothing),
            get(kwargs, :mc_remaining_time, nothing),
            get(kwargs, :ams_status, nothing),
            get(kwargs, :ams_rfid_status, nothing),
            get(kwargs, :hw_switch_state, nothing),
            get(kwargs, :spd_mag, nothing),
            get(kwargs, :spd_lvl, nothing),
            get(kwargs, :print_error, nothing),
            get(kwargs, :lifecycle, nothing),
            get(kwargs, :wifi_signal, nothing),
            get(kwargs, :gcode_state, nothing),
            get(kwargs, :gcode_file_prepare_percent, nothing),
            get(kwargs, :queue_number, nothing),
            get(kwargs, :queue_total, nothing),
            get(kwargs, :queue_est, nothing),
            get(kwargs, :queue_sts, nothing),
            get(kwargs, :project_id, nothing),
            get(kwargs, :profile_id, nothing),
            get(kwargs, :task_id, nothing),
            get(kwargs, :subtask_id, nothing),
            get(kwargs, :subtask_name, nothing),
            get(kwargs, :gcode_file, nothing),
            get(kwargs, :stg, []),
            get(kwargs, :stg_cur, nothing),
            get(kwargs, :print_type, nothing),
            get(kwargs, :home_flag, nothing),
            get(kwargs, :mc_print_line_number, nothing),
            get(kwargs, :mc_print_sub_stage, nothing),
            get(kwargs, :sdcard, false),
            get(kwargs, :force_upgrade, false),
            get(kwargs, :mess_production_state, nothing),
            get(kwargs, :layer_num, nothing),
            get(kwargs, :total_layer_num, nothing),
            get(kwargs, :s_obj, []),
            get(kwargs, :fan_gear, nothing),
            get(kwargs, :hms, []),
            get(kwargs, :online, nothing),
            get(kwargs, :ams, nothing),
            get(kwargs, :ipcam, nothing),
            get(kwargs, :vt_tray, nothing),
            get(kwargs, :lights_report, []),
            get(kwargs, :upgrade_state, nothing),
            get(kwargs, :command, nothing),
            get(kwargs, :msg, nothing),
            get(kwargs, :sequence_id, nothing)
        )
    end
end
