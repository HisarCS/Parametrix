# Parametrix

Welcome to this repository created for the Parametrix tool. Parametrix teaches parametric designing by combining an approachable, simple to use pixel art design and the Fusion 360 API. Below are the Javascript and Python docs for the Parametrix tool

# UI

### Application Components

Parametrix consists of the following major components:
1. **Electron Main Process**: Manages the application lifecycle, window creation, and IPC communication.
2. **HTML Renderer**: Provides user interface for navigation, level challenges, and feedback.
3. **Backend Communication**: Sends user commands to a Python-based backend for processing and visualization.
4. **Shape Configuration**: Loads and updates shapes dynamically from JSON files.
5. **Visualization**: Handles 2D rendering of 3D geometric shapes on a coordinate plane.

---

### Electron Main Process

The Electron main process serves as the backbone of the application, handling:
1. Application initialization.
2. Window management.
3. Communication between frontend and backend using IPC (Inter-Process Communication).

### Initialization

```javascript
const { app, BrowserWindow, ipcMain } = require("electron");
let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(renderHTML())}`);
});

