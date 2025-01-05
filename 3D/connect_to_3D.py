from bambu_connect import BambuClient

# Replace these with your actual details
hostname = ["PRINTER IP"]     
access_code = "[PRINTER ACSESS CODE]"     # Access code from printer
serial = "[PRINTER SERIAL NUM]"   # Printer's serial number

def main():
    try:
        # Initialize the BambuClient with direct values
        bambu_client = BambuClient(hostname, access_code, serial)

        # List files on the printer
        printer_files = bambu_client.get_files()
        print("Files on the printer:")
        for file in printer_files:
            print(file)

        # Example G-code for querying printer capabilities
        gcode_command = "[REQUESTED G-CODE COMMAND]"  # G-code to request printer info
        print(f"Sending G-code command: {gcode_command}")
        response = bambu_client.send_gcode(gcode_command)
        print("Response from printer:", response)

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()

print("This Python script is designed to interact with a 3D printer using the BambuClient from the bambu_connect library. It connects to the printer by providing three essential details: the printer's IP address (hostname), an access code (access_code), and the printer's serial number (serial). These are placeholders that need to be replaced with the actual information for the printer to be accessed successfully.

Within the main() function, the script initializes a BambuClient object using the provided details. This client serves as the interface for communication with the printer. After initialization, the script queries the printer for its list of files by calling the get_files() method on the bambu_client object. The files retrieved from the printer are then printed to the console, allowing the user to see what files are stored on the printer.

The script also includes an example of sending a G-code command to the printer. G-code is the language used to control 3D printers, and the script sends a placeholder command ([REQUESTED G-CODE COMMAND]) to query the printer's capabilities. The response from the printer is captured and displayed on the console, providing feedback about the printer's status or the result of the G-code command.

The try-except block is used to handle any potential errors that may arise during the interaction with the printer. If an error occurs (for example, if the connection details are incorrect or the printer is unreachable), the script will print an error message to the console, which helps in diagnosing issues during the execution of the script.

Finally, the script is designed to run as a standalone program. The if __name__ == "__main__": condition ensures that the main() function is executed only when the script is run directly, rather than being imported as a module in another script. This structure helps to encapsulate the logic of interacting with the printer while maintaining modularity and reusability of the code.")
