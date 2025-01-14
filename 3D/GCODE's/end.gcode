
;===== Final Motion Preparation =====
M400 ; Wait for buffer to clear
M17 X1.2 Y1.2 Z0.75 ; Set motor current to default
M204 S10000 ; Initialize ACC set to 10 m/s^2
M1002 set_gcode_claim_speed_level : 5
G92 E0 ; Zero the extruder
G1 E-0.3 F600 ; Retract filament slightly
M104 S175 ; Lower nozzle temperature
G1 Z{max_layer_z + 5} F900 ; Raise Z-axis slightly
G1 X65 Y255 F12000 ; Move to safe position
M400 S5 ; Wait for motion to complete
G92 E0 ; Zero the extruder
G1 E-0.3 F700 ; Additional retract
M400 S5 ; Wait
G92 E0 ; Zero the extruder
G1 Y265 F3000 ; Move to another position
M140 S0 ; Turn off bed heating
G1 X100 F12000 ; Perform wiping motion
M1002 gcode_claim_action : 4

;===== Cut Filament =====
M620 S255 ; Prepare AMS for filament pull-back
G1 X20 Y50 F12000 ; Move to filament cut position
G1 Y-3 ; Lower slightly
T255 ; Tool 255 indicates filament unloading
G1 X65 F12000 ; Move to retraction position
G1 Y265 ; Return to home position
M621 S255 ; Retract filament into AMS

;===== Wipe Nozzle =====
M104 S0 ; Turn off hotend
M1002 gcode_claim_action : 14
G1 X100 F18000 ; First wipe motion
G29.2 S0 ; Disable ABL
G1 X60 Y265 ; Move to another wiping position
G1 X100 F5000 ; Second wipe
G1 X70 F15000 ; Alternate wiping positions
G1 X100 F5000
G1 X70 F15000
G1 X100 F5000
G1 X70 F15000
G1 X100 F5000
G1 X70 F15000
G1 X90 F5000
M400 ; Wait for wiping to finish
G29.2 S1 ; Re-enable ABL
M975 S1 ; Enable vibration suppression
M400 ; Wait for actions to complete
M1002 gcode_claim_action : 0
M621 S255 ; Confirm AMS filament retraction
M104 S0 ; Ensure hotend is off

;===== Stop Camera (Timelapse) =====
M622.1 S1 ; For previous firmware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1 ; Finalize timelapse recording
M400 ; Wait for all motion to complete
M991 S0 P-1 ; End smooth timelapse at a safe position
M400 S3 ; Wait for the last picture to be taken
M623 ; Finalize timelapse
M400

;===== Lower Heatbed =====
M17 S ; Enable motors
M17 Z0.4 ; Lower Z motor current to reduce impact
{if (max_layer_z + 100.0) < 250}
G1 Z{max_layer_z + 100.0} F600 ; Lower bed if within height limit
G1 Z{max_layer_z + 98.0}
{else}
G1 Z249 F600 ; Otherwise, lower to max allowed
G1 Z247
{endif}
M400 P100 ; Wait to ensure safe lowering
G90 ; Ensure absolute positioning
G1 X128 Y250 F3600 ; Move to final parking position

;===== Reset Printer =====
M220 S100 ; Reset feedrate
M201.2 K1.0 ; Reset acceleration
M73.2 R1.0 ; Reset time magnitude
M1002 set_gcode_claim_speed_level : 0

;===== Fast Cool Down Chamber =====
M106 P1 S200 ; Set part cooling fan to 200
M106 P2 S200 ; Set auxiliary fan to 200
; M106 P3 S25 ; Chamber fan (NOCTUA)
M106 P3 S200 ; Chamber fan (BAMBU)
M400 S30 ; Wait 30 seconds for fast cooling

;===== Secondary Cool Down =====
M106 P1 S100 ; Set part cooling fan to 100
M106 P2 S100 ; Set auxiliary fan to 100
; M106 P3 S25 ; Chamber fan (NOCTUA)
M106 P3 S125 ; Chamber fan (BAMBU)
M400 S120 ; Wait 120 seconds for secondary cooling

;===== Switch Off Machine =====
M106 P1 S0 ; Turn off part cooling fan
M106 P2 S0 ; Turn off auxiliary fan
M106 P3 S0 ; Turn off chamber fan
M710 S0 ; Turn off MC-board fan
M17 X0.8 Y0.8 Z0.5 ; Lower motor current
M1002 gcode_claim_action : 0 ; Reset G-code claim
