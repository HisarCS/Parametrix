# Parametrix

Welcome to this repository created for the Parametrix tool. Parametrix teaches parametric designing by combining an approachable, simple to use pixel art design and the Fusion 360 API. Below are the Javascript and Python docs for the Parametrix tool

#### Further Details

This is a completely open source project so if you want to add something or make a suggestion just send a pull up request.) If you want to learn more you can visit the OpenSourceDocs folder

### Description

Parametric design is a transformative approach in Computer-Aided Design (CAD) where geometry adapts dynamically based on user-defined parameters. Despite its powerful applications in digital fabrication, learning parametric design remains a challenge for beginners due to complex tools and steep learning curves.
This is where Parametrix comes in—a user-friendly tool designed to make parametric design accessible and engaging. Through a pixel art interface, users may input prompts such as “Create a 10x10 square with a 5-unit circle inside.” in order to create simple geometries in Fusion 360. Additionally, the user may create more complex designs as well. Picture a student typing,“Design a rocket body with a 100-unit tall cylinder and cone-shaped nose, then add 4 fins, each 20x10 units.”  Within seconds, the system generates a fully parametric 3D rocket model, ready for fine-tuning in Fusion 360, allowing students to explore real world geometries through a parametric lens.
The system architecture focuses on a seamless interaction between the frontend and backend. User prompts are captured in the frontend, then sent to the backend via the Flask server, after receiving the prompts are interpreted by a natural language processing model- flan-t5 model-  and converted into a JSON protocol. This JSON file is then sent to the Fusion 360 Python API script, which sketches the geometries dynamically based on the provided parameters.


## UI

Below are the photos for the interfaces of the website(the code is explained in other sections:

### Main interface

<img width="794" alt="Ekran Resmi 2025-01-04 18 26 47" src="https://github.com/user-attachments/assets/fbaf3d03-5061-4fc0-a8b2-f51a1b17d1f4" />


### Selection View
<img width="1680" alt="Ekran Resmi 2025-01-03 10 22 57" src="https://github.com/user-attachments/assets/776fe78d-fbff-4c4c-80e2-a8327490fb32" />


### Main user interface
<img width="1680" alt="Ekran Resmi 2025-01-03 10 23 44" src="https://github.com/user-attachments/assets/b7d1f764-8164-4a84-be3c-02f49801787a" />

### Level Selection Interface

<img width="787" alt="Ekran Resmi 2025-01-04 18 27 39" src="https://github.com/user-attachments/assets/b80aeb06-f7cd-43b0-a981-20697f4c88d4" />

### Sample Tutorial Interface

<img width="1680" alt="Ekran Resmi 2025-01-04 19 08 14" src="https://github.com/user-attachments/assets/25f38b4e-e881-4b30-992f-65062384478f" />
