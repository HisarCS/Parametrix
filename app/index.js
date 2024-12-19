const { app, BrowserWindow, ipcMain } = require("electron");
const axios = require("axios");

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

  // Load the initial page
  mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(renderHTML())}`);
});

// Function to handle backend communication
ipcMain.on("send-command", async (event, command) => {
  try {
    const response = await axios.post("http://127.0.0.1:5001/process", { command });
    event.sender.send("command-response", response.data); // Send the AI response back to the renderer
  } catch (error) {
    console.error("Error communicating with the backend:", error.message);
    event.sender.send("command-response", { error: "Failed to connect to the server." });
  }
});


function renderHTML() {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Parametrix</title>
          <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: black;
              color: white;
              font-family: 'Press Start 2P', cursive;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              height: 100vh;
              text-align: center;
            }
            h1 {
              font-size: 4rem;
              text-transform: uppercase;
              margin-bottom: 40px;
              letter-spacing: 2px;
            }
            h1 span {
              color: #FFA500;
            }
            .start-button {
              font-size: 1rem;
              text-transform: uppercase;
              font-family: 'Press Start 2P', cursive;
              color: white;
              background: none;
              border: 2px solid white;
              padding: 10px 20px;
              cursor: pointer;
              margin-top: 20px;
              transition: transform 0.2s, background-color 0.2s, box-shadow 0.2s;
            }
            .start-button:hover {
              color: black;
              background-color: #FFA500;
              box-shadow: 0 0 10px #FFA500;
              transform: scale(1.1);
            }
            .start-button:focus {
              outline: none;
            }
            .start-message {
              margin-top: 30px;
              font-size: 0.7rem;
              animation: blink 1.2s infinite;
              color: #bbb;
              text-transform: uppercase;
            }
            @keyframes blink {
              0%, 50% {
                opacity: 1;
              }
              100% {
                opacity: 0;
              }
            }
            .footer {
              position: absolute;
              bottom: 20px;
              font-size: 1.5rem;
            }
          </style>
        </head>
        <body>
          <h1><span>PARAMETRI</span>X</h1>
          <button class="start-button" onclick="loadLevelSelection()">Start</button>
          <p class="start-message">Press Enter to Start</p>
          <div class="footer">.)</div>
          <script>
            const { ipcRenderer } = require("electron");
            function loadLevelSelection() {
              ipcRenderer.send("load-level-selection");
            }
          </script>
        </body>
      </html>
    `;
  }
  
  
  function renderLevel1Page() {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Level 1</title>
          <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: black;
              color: white;
              font-family: 'Press Start 2P', cursive;
              display: flex;
              flex-direction: column;
              height: 100vh;
              overflow: hidden;
            }
            .container {
              display: flex;
              height: 100%;
            }
            .left-side {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              padding: 20px;
              border-right: 2px solid white;
              overflow-y: auto;
            }
            .prompt-history {
              flex-grow: 1;
              overflow-y: auto;
              margin-bottom: 20px;
            }
            .prompt-item {
              margin-bottom: 10px;
            }
            .input-container {
              display: flex;
              align-items: center;
            }
            .prompt-input {
              flex-grow: 1;
              padding: 10px;
              font-size: 1rem;
              background-color: black;
              color: white;
              border: 2px solid white;
              font-family: 'Press Start 2P', cursive;
            }
            .send-button {
              margin-left: 10px;
              padding: 10px 20px;
              font-size: 1rem;
              background-color: black;
              color: white;
              border: 2px solid white;
              cursor: pointer;
              font-family: 'Press Start 2P', cursive;
              transition: background-color 0.2s, transform 0.2s;
            }
            .send-button:hover {
              background-color: navy;
              transform: scale(1.1);
            }
            .right-side {
              flex: 1;
              display: flex;
              flex-direction: column;
              padding: 20px;
              overflow-y: auto;
            }
            .instruction-header {
              font-size: 1.2rem;
              margin-bottom: 20px;
            }
            .instruction-item {
              margin-bottom: 10px;
            }
            .shape-output {
              margin-top: 20px;
              padding: 10px;
              border: 2px solid white;
              width: 100%;
              height: 150px;
              background-color: black;
              color: white;
              overflow-y: auto;
              font-family: 'Press Start 2P', cursive;
            }
            .back-button {
              font-size: 1rem;
              text-transform: uppercase;
              font-family: 'Press Start 2P', cursive;
              color: white;
              background: none;
              border: 2px solid white;
              padding: 10px 20px;
              cursor: pointer;
              align-self: center;
              transition: transform 0.2s, background-color 0.2s, box-shadow 0.2s;
            }
            .back-button:hover {
              background-color: cyan;
              color: black;
              box-shadow: 0 0 10px cyan;
              transform: scale(1.1);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="left-side">
              <div class="prompt-history" id="prompt-history">Welcome to Level 1</div>
              <div class="input-container">
                <input id="prompt-input" class="prompt-input" placeholder="Type your command..." />
                <button class="send-button" onclick="sendPrompt()">Send</button>
              </div>
            </div>
            <div class="right-side">
              <div class="instruction-header">Level 1: Sketch Tutorial</div>
              <div class="instruction-item" id="instruction-text">1. Draw two circles that intersect each other and contain the origin.</div>
              <div class="shape-output" id="shape-output">Awaiting input...</div>
              <button class="back-button" onclick="goBack()">Back</button>
            </div>
          </div>
          <script>
            const { ipcRenderer } = require("electron");
  
            function sendPrompt() {
              const inputField = document.getElementById("prompt-input");
              const promptHistory = document.getElementById("prompt-history");
              const shapeOutput = document.getElementById("shape-output");
  
              const promptText = inputField.value.trim();
              if (!promptText) {
                alert("Please enter a prompt.");
                return;
              }
  
              // Add user prompt to the history
              const userPrompt = document.createElement("div");
              userPrompt.classList.add("prompt-item");
              userPrompt.textContent = "You: " + promptText;
              promptHistory.appendChild(userPrompt);
  
              ipcRenderer.send("send-command", promptText);
  
              ipcRenderer.once("command-response", (event, response) => {
                const aiResponse = document.createElement("div");
                aiResponse.classList.add("prompt-item");
  
                if (response && response.response) {
                  aiResponse.textContent = "AI: " + response.response;
                  shapeOutput.textContent = response.response;
                } else if (response && response.error) {
                  aiResponse.textContent = "Error: " + response.error;
                  shapeOutput.textContent = "Error: " + response.error;
                } else {
                  aiResponse.textContent = "No response received from the server.";
                  shapeOutput.textContent = "No response received from the server.";
                }
  
                promptHistory.appendChild(aiResponse);
                promptHistory.scrollTop = promptHistory.scrollHeight;
              });
  
              inputField.value = "";
            }
  
            function goBack() {
              ipcRenderer.send("go-back-to-levels");
            }
          </script>
        </body>
      </html>
    `;
  }


  function selectLevel(level) {
    const { ipcRenderer } = require("electron");
    ipcRenderer.send("start-level", level);
  }
  

  function renderLevelSelectionPage() {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Level Selection</title>
          <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: black;
              color: white;
              font-family: 'Press Start 2P', cursive;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              height: 100vh;
              text-align: center;
            }
            h1 {
              font-size: 2rem;
              margin-bottom: 20px;
            }
            .grid-container {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              grid-gap: 15px;
              width: 60%;
              max-width: 500px;
            }
            .grid-item {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
              padding: 30px 0;
              background-color: black;
              border: 2px solid white;
              cursor: pointer;
              transition: transform 0.2s, box-shadow 0.2s;
              font-size: 1.5rem;
            }
            .grid-item:hover {
              transform: scale(1.1);
              box-shadow: 0 0 15px white;
            }
            .back-button {
              font-size: 1rem;
              text-transform: uppercase;
              font-family: 'Press Start 2P', cursive;
              color: white;
              background: none;
              border: 2px solid white;
              padding: 10px 20px;
              cursor: pointer;
              margin-top: 20px;
              transition: transform 0.2s, background-color 0.2s, box-shadow 0.2s;
            }
            .back-button:hover {
              color: black;
              background-color: cyan;
              box-shadow: 0 0 10px cyan;
              transform: scale(1.1);
            }
            .back-button:focus {
              outline: none;
            }
          </style>
        </head>
        <body>
          <h1>Select a Level</h1>
          <div class="grid-container">
            ${Array.from({ length: 6 }, (_, i) => `<div class="grid-item" onclick="selectLevel(${i + 1})">${i + 1}</div>`).join('')}
          </div>
          <button class="back-button" onclick="goBack()">Back</button>
          <script>
            function selectLevel(level) {
              const { ipcRenderer } = require("electron");
              ipcRenderer.send("start-level", level);
            }
            function goBack() {
              const { ipcRenderer } = require("electron");
              ipcRenderer.send("go-back-to-main");
            }
          </script>
        </body>
      </html>
    `;
  }
  

function renderLevelPage(level) {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Level ${level}</title>
          <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: black;
              color: white;
              font-family: 'Press Start 2P', cursive;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: center;
              height: 100vh;
              text-align: center;
            }
            h1 {
              font-size: 2.5rem;
              margin-top: 40px;
              color: #FFA500;
            }
            p {
              font-size: 1rem;
              max-width: 600px;
              line-height: 1.5;
            }
            .back-button {
              font-size: 1rem;
              text-transform: uppercase;
              font-family: 'Press Start 2P', cursive;
              color: white;
              background: none;
              border: 2px solid white;
              padding: 10px 20px;
              cursor: pointer;
              margin-bottom: 20px;
              transition: transform 0.2s, background-color 0.2s, box-shadow 0.2s;
            }
            .back-button:hover {
              color: black;
              background-color: cyan;
              box-shadow: 0 0 10px cyan;
              transform: scale(1.1);
            }
            .back-button:focus {
              outline: none;
            }
          </style>
        </head>
        <body>
          <h1>Level ${level}</h1>
          <p>Welcome to Level ${level}. Get ready to explore parametric design concepts!</p>
          <button class="back-button" onclick="goBack()">Back</button>
          <script>
            function goBack() {
              const { ipcRenderer } = require("electron");
              ipcRenderer.send("go-back-to-levels"); // Send an event to go back
            }
          </script>
        </body>
      </html>
    `;
  }
  


  function renderLevel2Page() {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Level 2</title>
          <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: black;
              color: white;
              font-family: 'Press Start 2P', cursive;
              display: flex;
              flex-direction: column;
              height: 100vh;
              overflow: hidden;
            }
            .container {
              display: flex;
              height: 100%;
            }
            .left-side {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              padding: 20px;
              border-right: 2px solid white;
              overflow-y: auto;
            }
            .prompt-history {
              flex-grow: 1;
              overflow-y: auto;
              margin-bottom: 20px;
            }
            .prompt-item {
              margin-bottom: 10px;
            }
            .input-container {
              display: flex;
              align-items: center;
            }
            .prompt-input {
              flex-grow: 1;
              padding: 10px;
              font-size: 1rem;
              background-color: black;
              color: white;
              border: 2px solid white;
              font-family: 'Press Start 2P', cursive;
            }
            .send-button {
              margin-left: 10px;
              padding: 10px 20px;
              font-size: 1rem;
              background-color: black;
              color: white;
              border: 2px solid white;
              cursor: pointer;
              font-family: 'Press Start 2P', cursive;
              transition: background-color 0.2s, transform 0.2s;
            }
            .send-button:hover {
              background-color: navy;
              transform: scale(1.1);
            }
            .right-side {
              flex: 1;
              display: flex;
              flex-direction: column;
              padding: 20px;
              overflow-y: auto;
            }
            .instruction-header {
              font-size: 1.2rem;
              margin-bottom: 20px;
            }
            .instruction-item {
              margin-bottom: 10px;
            }
            .shape-output {
              margin-top: 20px;
              padding: 10px;
              border: 2px solid white;
              width: 100%;
              height: 150px;
              background-color: black;
              color: white;
              overflow-y: auto;
              font-family: 'Press Start 2P', cursive;
            }
            .back-button {
              font-size: 1rem;
              text-transform: uppercase;
              font-family: 'Press Start 2P', cursive;
              color: white;
              background: none;
              border: 2px solid white;
              padding: 10px 20px;
              cursor: pointer;
              align-self: center;
              transition: transform 0.2s, background-color 0.2s, box-shadow 0.2s;
            }
            .back-button:hover {
              background-color: cyan;
              color: black;
              box-shadow: 0 0 10px cyan;
              transform: scale(1.1);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="left-side">
              <div class="prompt-history" id="prompt-history">Welcome to Level 2</div>
              <div class="input-container">
                <input id="prompt-input" class="prompt-input" placeholder="Type your command..." />
                <button class="send-button" onclick="sendPrompt()">Send</button>
              </div>
            </div>
            <div class="right-side">
              <div class="instruction-header">Level 2: Rectangle Challenge</div>
              <div class="instruction-item" id="instruction-text">
                1. Create a design with:
                <ul>
                  <li>Three rectangles that align perfectly on their edges</li>
                  <li>One rectangle that overlaps two of them</li>
                  <li>One rectangle that is completely independent</li>
                </ul>
              </div>
              <div class="shape-output" id="shape-output">Awaiting input...</div>
              <button class="back-button" onclick="goBack()">Back</button>
            </div>
          </div>
          <script>
            const { ipcRenderer } = require("electron");
  
            function sendPrompt() {
              const inputField = document.getElementById("prompt-input");
              const promptHistory = document.getElementById("prompt-history");
              const shapeOutput = document.getElementById("shape-output");
  
              const promptText = inputField.value.trim();
              if (!promptText) {
                alert("Please enter a prompt.");
                return;
              }
  
              // Add user prompt to the history
              const userPrompt = document.createElement("div");
              userPrompt.classList.add("prompt-item");
              userPrompt.textContent = "You: " + promptText;
              promptHistory.appendChild(userPrompt);
  
              ipcRenderer.send("send-command", promptText);
  
              ipcRenderer.once("command-response", (event, response) => {
                const aiResponse = document.createElement("div");
                aiResponse.classList.add("prompt-item");
  
                if (response && response.response) {
                  aiResponse.textContent = "AI: " + response.response;
                  shapeOutput.textContent = response.response;
                } else if (response && response.error) {
                  aiResponse.textContent = "Error: " + response.error;
                  shapeOutput.textContent = "Error: " + response.error;
                } else {
                  aiResponse.textContent = "No response received from the server.";
                  shapeOutput.textContent = "No response received from the server.";
                }
  
                promptHistory.appendChild(aiResponse);
                promptHistory.scrollTop = promptHistory.scrollHeight;
              });
  
              inputField.value = "";
            }
  
            function goBack() {
              ipcRenderer.send("go-back-to-levels");
            }
          </script>
        </body>
      </html>
    `;
  }
  function renderLevel3Page() {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Level 3</title>
          <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: black;
              color: white;
              font-family: 'Press Start 2P', cursive;
              display: flex;
              flex-direction: column;
              height: 100vh;
              overflow: hidden;
            }
            .container {
              display: flex;
              height: 100%;
            }
            .left-side {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              padding: 20px;
              border-right: 2px solid white;
              overflow-y: auto;
            }
            .prompt-history {
              flex-grow: 1;
              overflow-y: auto;
              margin-bottom: 20px;
            }
            .prompt-item {
              margin-bottom: 10px;
            }
            .input-container {
              display: flex;
              align-items: center;
            }
            .prompt-input {
              flex-grow: 1;
              padding: 10px;
              font-size: 1rem;
              background-color: black;
              color: white;
              border: 2px solid white;
              font-family: 'Press Start 2P', cursive;
            }
            .send-button {
              margin-left: 10px;
              padding: 10px 20px;
              font-size: 1rem;
              background-color: black;
              color: white;
              border: 2px solid white;
              cursor: pointer;
              font-family: 'Press Start 2P', cursive;
              transition: background-color 0.2s, transform 0.2s;
            }
            .send-button:hover {
              background-color: navy;
              transform: scale(1.1);
            }
            .right-side {
              flex: 1;
              display: flex;
              flex-direction: column;
              padding: 20px;
              overflow-y: auto;
            }
            .instruction-header {
              font-size: 1.2rem;
              margin-bottom: 20px;
            }
            .instruction-item {
              margin-bottom: 10px;
            }
            .shape-output {
              margin-top: 20px;
              padding: 10px;
              border: 2px solid white;
              width: 100%;
              height: 150px;
              background-color: black;
              color: white;
              overflow-y: auto;
              font-family: 'Press Start 2P', cursive;
            }
            .back-button {
              font-size: 1rem;
              text-transform: uppercase;
              font-family: 'Press Start 2P', cursive;
              color: white;
              background: none;
              border: 2px solid white;
              padding: 10px 20px;
              cursor: pointer;
              align-self: center;
              transition: transform 0.2s, background-color 0.2s, box-shadow 0.2s;
            }
            .back-button:hover {
              background-color: cyan;
              color: black;
              box-shadow: 0 0 10px cyan;
              transform: scale(1.1);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="left-side">
              <div class="prompt-history" id="prompt-history">Welcome to Level 3</div>
              <div class="input-container">
                <input id="prompt-input" class="prompt-input" placeholder="Type your command..." />
                <button class="send-button" onclick="sendPrompt()">Send</button>
              </div>
            </div>
            <div class="right-side">
              <div class="instruction-header">Level 3: Triangle Challenge</div>
              <div class="instruction-item" id="instruction-text">
                1. Create a design with:
                <ul>
                  <li>Three triangles of different sizes</li>
                  <li>Ensure that no two triangles overlap</li>
                  <li>Place them in a symmetrical arrangement</li>
                </ul>
              </div>
              <div class="shape-output" id="shape-output">Awaiting input...</div>
              <button class="back-button" onclick="goBack()">Back</button>
            </div>
          </div>
          <script>
            const { ipcRenderer } = require("electron");
  
            function sendPrompt() {
              const inputField = document.getElementById("prompt-input");
              const promptHistory = document.getElementById("prompt-history");
              const shapeOutput = document.getElementById("shape-output");
  
              const promptText = inputField.value.trim();
              if (!promptText) {
                alert("Please enter a prompt.");
                return;
              }
  
              // Add user prompt to the history
              const userPrompt = document.createElement("div");
              userPrompt.classList.add("prompt-item");
              userPrompt.textContent = "You: " + promptText;
              promptHistory.appendChild(userPrompt);
  
              ipcRenderer.send("send-command", promptText);
  
              ipcRenderer.once("command-response", (event, response) => {
                const aiResponse = document.createElement("div");
                aiResponse.classList.add("prompt-item");
  
                if (response && response.response) {
                  aiResponse.textContent = "AI: " + response.response;
                  shapeOutput.textContent = response.response;
                } else if (response && response.error) {
                  aiResponse.textContent = "Error: " + response.error;
                  shapeOutput.textContent = "Error: " + response.error;
                } else {
                  aiResponse.textContent = "No response received from the server.";
                  shapeOutput.textContent = "No response received from the server.";
                }
  
                promptHistory.appendChild(aiResponse);
                promptHistory.scrollTop = promptHistory.scrollHeight;
              });
  
              inputField.value = "";
            }
  
            function goBack() {
              ipcRenderer.send("go-back-to-levels");
            }
          </script>
        </body>
      </html>
    `;
  }
  

  function renderLevel4Page() {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Level 4</title>
          <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: black;
              color: white;
              font-family: 'Press Start 2P', cursive;
              display: flex;
              flex-direction: column;
              height: 100vh;
              overflow: hidden;
            }
            .container {
              display: flex;
              height: 100%;
            }
            .left-side {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              padding: 20px;
              border-right: 2px solid white;
              overflow-y: auto;
            }
            .prompt-history {
              flex-grow: 1;
              overflow-y: auto;
              margin-bottom: 20px;
            }
            .prompt-item {
              margin-bottom: 10px;
            }
            .input-container {
              display: flex;
              align-items: center;
            }
            .prompt-input {
              flex-grow: 1;
              padding: 10px;
              font-size: 1rem;
              background-color: black;
              color: white;
              border: 2px solid white;
              font-family: 'Press Start 2P', cursive;
            }
            .send-button {
              margin-left: 10px;
              padding: 10px 20px;
              font-size: 1rem;
              background-color: black;
              color: white;
              border: 2px solid white;
              cursor: pointer;
              font-family: 'Press Start 2P', cursive;
              transition: background-color 0.2s, transform 0.2s;
            }
            .send-button:hover {
              background-color: navy;
              transform: scale(1.1);
            }
            .right-side {
              flex: 1;
              display: flex;
              flex-direction: column;
              padding: 20px;
              overflow-y: auto;
            }
            .instruction-header {
              font-size: 1.2rem;
              margin-bottom: 20px;
            }
            .instruction-item {
              margin-bottom: 10px;
            }
            .shape-output {
              margin-top: 20px;
              padding: 10px;
              border: 2px solid white;
              width: 100%;
              height: 150px;
              background-color: black;
              color: white;
              overflow-y: auto;
              font-family: 'Press Start 2P', cursive;
            }
            .back-button {
              font-size: 1rem;
              text-transform: uppercase;
              font-family: 'Press Start 2P', cursive;
              color: white;
              background: none;
              border: 2px solid white;
              padding: 10px 20px;
              cursor: pointer;
              align-self: center;
              transition: transform 0.2s, background-color 0.2s, box-shadow 0.2s;
            }
            .back-button:hover {
              background-color: cyan;
              color: black;
              box-shadow: 0 0 10px cyan;
              transform: scale(1.1);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="left-side">
              <div class="prompt-history" id="prompt-history">Welcome to Level 4</div>
              <div class="input-container">
                <input id="prompt-input" class="prompt-input" placeholder="Type your command..." />
                <button class="send-button" onclick="sendPrompt()">Send</button>
              </div>
            </div>
            <div class="right-side">
              <div class="instruction-header">Level 4: Ellipse Challenge</div>
              <div class="instruction-item" id="instruction-text">
                1. Create a design with:
                <ul>
                  <li>Two ellipses that overlap partially</li>
                  <li>One ellipse completely inside another</li>
                  <li>Ensure all ellipses are centered along the x-axis</li>
                </ul>
              </div>
              <div class="shape-output" id="shape-output">Awaiting input...</div>
              <button class="back-button" onclick="goBack()">Back</button>
            </div>
          </div>
          <script>
            const { ipcRenderer } = require("electron");
  
            function sendPrompt() {
              const inputField = document.getElementById("prompt-input");
              const promptHistory = document.getElementById("prompt-history");
              const shapeOutput = document.getElementById("shape-output");
  
              const promptText = inputField.value.trim();
              if (!promptText) {
                alert("Please enter a prompt.");
                return;
              }
  
              // Add user prompt to the history
              const userPrompt = document.createElement("div");
              userPrompt.classList.add("prompt-item");
              userPrompt.textContent = "You: " + promptText;
              promptHistory.appendChild(userPrompt);
  
              ipcRenderer.send("send-command", promptText);
  
              ipcRenderer.once("command-response", (event, response) => {
                const aiResponse = document.createElement("div");
                aiResponse.classList.add("prompt-item");
  
                if (response && response.response) {
                  aiResponse.textContent = "AI: " + response.response;
                  shapeOutput.textContent = response.response;
                } else if (response && response.error) {
                  aiResponse.textContent = "Error: " + response.error;
                  shapeOutput.textContent = "Error: " + response.error;
                } else {
                  aiResponse.textContent = "No response received from the server.";
                  shapeOutput.textContent = "No response received from the server.";
                }
  
                promptHistory.appendChild(aiResponse);
                promptHistory.scrollTop = promptHistory.scrollHeight;
              });
  
              inputField.value = "";
            }
  
            function goBack() {
              ipcRenderer.send("go-back-to-levels");
            }
          </script>
        </body>
      </html>
    `;
  }
  

// Handle navigation between pages
ipcMain.on("load-level-selection", () => {
  mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(renderLevelSelectionPage())}`);
});

ipcMain.on("start-level", (event, level) => {
  mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(renderLevelPage(level))}`);
});

ipcMain.on("go-back-to-levels", () => {
    // Navigate back to the Level Selection Page
    mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(renderLevelSelectionPage())}`);
  });

  
  ipcMain.on("start-level", (event, level) => {
    if (level === 1) {
      mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(renderLevel1Page())}`);
    }
  });

  ipcMain.on("start-level", (event, level) => {
    if (level === 2) {
      mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(renderLevel2Page())}`);
    }
  });

  ipcMain.on("start-level", (event, level) => {
    if (level === 3) {
      mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(renderLevel3Page())}`);
    }
  });

  ipcMain.on("start-level", (event, level) => {
    if (level === 4) {
      mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(renderLevel4Page())}`);
    }
  });
  
  ipcMain.on("go-back-to-main", () => {
    mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(renderHTML())}`);
  });
  
  // IPC Event for Backend Communication

  ipcMain.on("send-command", async (event, command) => {
    try {
      const response = await axios.post("http://127.0.0.1:5001/process", { command });
      event.sender.send("command-response", response.data);
    } catch (error) {
      console.error("Error communicating with the backend:", error);
      event.sender.send("command-response", { error: "Failed to process the command." });
    }
  });
  
  
