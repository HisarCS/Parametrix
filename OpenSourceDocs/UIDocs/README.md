# Project Documentation and Development Guide

## Table of Contents
- [Overview](#overview)
- [Setup and Installation](#setup-and-installation)
- [Project Structure](#project-structure)
- [Component Descriptions](#component-descriptions)
- [Code Breakdown](#code-breakdown)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Development Guide](#development-guide)
- [Advanced Topics](#advanced-topics)
- [Troubleshooting](#troubleshooting)
- [Contributors](#contributors)
- [Copyright](#copyright)

---

## Overview

This project is a web-based parametric design tool that allows users to create and visualize geometric shapes in 2D and 3D. It supports exporting models in DXF and STL formats. The application is built with **React**, **Three.js**, and a **Node.js** backend with **Express.js** handling API requests.

---

## Setup and Installation

### Prerequisites(for front end)
Ensure you have the following installed:
- **Node.js** (>=16.x.x)
- **npm** or **yarn**

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/project.git
   cd project
   ```
2. Install dependencies:
   ```sh
   npm install  # or yarn install
   ```
3. Start the frontend:
   ```sh
   npm start
   ```
5. Open your browser and navigate to `http://localhost:3000`.

---

## Project Structure
```
project/
├── backend/               # Backend service (Node.js & Express.js)
│   ├── server.js         # Main backend server
│   ├── routes/           # API routes
│   ├── models/           # Data models and processing logic
│   ├── controllers/      # API logic handling
│   ├── config/           # Configuration files
│   ├── package.json      # Backend dependencies
│
├── frontend/              # Frontend React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── assets/       # Static assets
│   │   ├── styles/       # CSS files
│   │   ├── App.js        # Main app component
│   │   ├── index.js      # Entry point
│   ├── public/
│   ├── package.json      # Frontend dependencies
│   ├── webpack.config.js # Webpack configuration
│   └── README.md         # Frontend documentation
```

---

## Component Descriptions

### `MainPage.js`
The landing page that routes users to the main sections of the application.

### `Wildcard.js`
Generates a randomized selection screen for exploration-based navigation.

### `Select.js`
Handles user level selection dynamically based on pre-configured levels.

### `SplitSelection.js`
Provides an interface to choose between **Parametrix** (design mode) and **Tutorials**.

### `ThreeDView.js`
Renders 3D models using **Three.js**, handling shape transformations and extrusion.

### `ParametrixView.js`
Main interface for parametric modeling, managing:
- **Shape creation and processing**
- **2D and 3D Views**
- **File export options (DXF, STL)**

### `CoordinatePlane.js`
Handles 2D visualization of geometric objects on a canvas.

### `book1.js`
Manages the tutorial system, tracking user progress and validating exercises.

---

## Code Breakdown

### **Frontend**
- **React.js for UI**
- **Three.js for 3D rendering**
- **State Management with Context API**
- **LocalStorage for user-generated shape caching**

### **Backend**
- **Express.js for API handling**
- **Shape processing and DXF/STL generation**
- **MongoDB (if used) for storing user data**

---

## Usage

1. **Navigate to the main page** (`/`)
2. **Select a mode**:
   - *Parametrix*: Design parametric models
   - *Tutorials*: Learn how to create models
3. **Create and modify shapes**:
   - Input parameters
   - Adjust position, size, and extrusion
4. **Export models**:
   - DXF for CAD
   - STL for 3D printing

---

## API Endpoints

| Endpoint            | Method | Description                  |
|--------------------|--------|------------------------------|
| `/process`         | POST   | Handles shape generation     |
| `/generate_dxf`    | POST   | Converts shapes to DXF       |
| `/generate_stl`    | POST   | Converts shapes to STL       |
| `/health`          | GET    | Backend status check         |

---

## Development Guide

### Adding Features
- Modify `ParametrixView.js` for new shape types
- Extend `ThreeDView.js` for additional 3D shapes
- Update `server.js` and `routes/` to support new API calls

### Debugging
- Use `console.log` in React components for frontend debugging
- Use Postman to test API responses
- Check `server.js` logs for backend issues

---

## Advanced Topics

### Implementing New File Formats
To support additional file formats beyond DXF and STL, update:
- **Backend**: Modify shape processing logic
- **Frontend**: Extend file export options

### Real-time Collaboration
Integrating **WebSockets** can allow real-time multi-user collaboration.

---

## Troubleshooting

| Issue                  | Solution                                      |
|------------------------|----------------------------------------------|
| Frontend not starting  | Ensure dependencies are installed (`npm i`)  |
| Backend API failure    | Check `server.js` logs for errors            |
| Shapes not rendering   | Debug component state changes in React       |

For further help, open an issue in the GitHub repository.

---

## Contributors
- **Emre Dayangaç** - Developer
- **HisarCS Team** - Maintainers

---

## Copyright

© 2025 HisarCS Team. All rights reserved. Unauthorized duplication or distribution of this software is prohibited.

