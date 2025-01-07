# UI Docs

## Description

This is the explanation for the UI code of the project mainly written in Javascript & React

## Prerequisites

Ensure you have Node.js and npm installed. A code editor like VS Code is recommended for editing the project files.

## Development Environment Setup

Clone the repository and navigate to the project directory:

- `git clone <repository-url>`
- `cd path/to/project`

Install necessary dependencies:

- `npm install`

## File Explanation: `index.js`

- **Imports**: The file imports React, ReactDOM, main CSS, and the App component.
- **Root Container**: Creates a root container using `ReactDOM.createRoot` and attaches it to the `root` div in the HTML.
- **Rendering**: Renders the `<App />` component within the root container.

## Building the Project

Build the project for production by running:

- `npm run build`

This compiles the application into static files in the `build` directory.

## Performance Measurement

To measure the performance of your app, pass a function to log results or send them to an analytics endpoint. More information available at [React CRA vitals](https://bit.ly/CRA-vitals).

element` property, where `element` specifies the component rendered when the route is matched.

## Route Definitions

### Main Page Route
- **Path**: `/`
- **Component**: `MainPage`
- Description: This is the default route that renders the `MainPage` component.

### Split Selection Route
- **Path**: `/split`
- **Component**: `SplitSelection`
- Description: This route renders the `SplitSelection` component, where users can choose from split options.

### Parametrix View Route
- **Path**: `/parametrix`
- **Component**: `ParametrixView`
- Description: This route displays the `ParametrixView` component, designed for users to view and adjust parameters.

### Level Selection Route
- **Path**: `/levelselection`
- **Component**: `Select`
- Description: This route renders the `Select` component, enabling users to select different levels or settings.


## MainPage Component

### Imports

- **React**: Importing React for creating components.
- **useNavigate**: Importing `useNavigate` from `react-router-dom` for programmatic navigation.

### Component Structure

The `MainPage` component uses React's `createElement` method to build the UI without JSX. It features a navigation button and styled text elements.

### Style and Layout

The component sets up a full-page layout with a flex display, centered content, and styling:

- **Container**: Full viewport height, flex display with column direction, centered items, black background, and white text.
- **Font**: Uses the 'Press Start 2P' font for a retro, pixelated look.

### Title Element

- Styled with uppercase, large font size, and orange color accent for the "PARAMETRI" part.
- Emphasizes the brand or key element of the application.

### Navigation Button

- **Functionality**: Navigates to the `/split` route when clicked.
- **Styling**: Black background, white text, uppercase, and pixelated font. The style changes on hover, with a scale transform and color inversion for interactive feedback.

### Blinking Text

- Provides additional interactive guidance with a blinking animation effect, indicating that the user can start the application by pressing enter.
- Styled with a subtle grey color and smaller font size to maintain focus on the main elements.

### Interaction and Animation

- Utilizes CSS transitions and transformations to enhance the user interaction experience, making the UI dynamic and engaging.

## SplitSelection Component

### Imports

- **React**: Importing React for creating components.
- **useNavigate**: Importing `useNavigate` from `react-router-dom` for programmatic navigation.

### Component Structure

The `SplitSelection` component utilizes React's JSX syntax to create a UI with two main sections: "Parametrix" and "Tutorials". Each section contains a button that navigates to different parts of the application.

### Style and Layout

The component is designed with a full viewport height and flex display to split the view into two equal parts:

- **General Style**: Uses the retro, pixelated 'Press Start 2P' font.

### Parametrix Section

- **Background and Border**: Beige background with a black border on the right to separate from the Tutorials section.
- **Button**: Styled with a transformation on hover, changing background and text color for interactive feedback.
- **Navigation**: The button navigates to the `/parametrix` route.

### Tutorials Section

- **Background**: Solid black background contrasting with the beige of the Parametrix section.
- **Button**: Also styled for interactive feedback with color and scale transformations on hover.
- **Navigation**: The button navigates to the `/levelselection` route.

### Back Button

- **Positioning**: Positioned absolutely at the bottom-right corner of the Tutorials section.
- **Style and Interaction**: The button changes background and text color on hover, scaling up for emphasis.
- **Functionality**: Navigates back to the main page (`/`).

### Interaction and Animation

The component uses CSS transitions to enhance the user interaction experience, adding dynamic visual feedback to button interactions through color changes and scaling effects.

## ParametrixView Component

### Imports

- **React**: Importing React to use hooks and components.
- **useState**: Importing `useState` from React for state management.
- **useNavigate**: Importing `useNavigate` from `react-router-dom` for navigation.
- **axios**: Importing axios for making HTTP requests.
- **CoordinatePlane**: Importing a custom component, ensuring it is available for use.

### Component Structure

`ParametrixView` is a React component designed to interact with a backend service and display results on a coordinate plane.

### State Management

The component manages several pieces of state:

- **shapes**: Stores shapes returned from the backend.
- **prompt**: Holds the current input from the user.
- **history**: Maintains a log of interactions for display.

### Functions

- **handleSendPrompt**: Sends the current prompt to a backend endpoint and updates the history and shapes based on the response.
- **handleClear**: Clears both the shapes and history states.
- **handleBack**: Navigates back to the `/split` route using `useNavigate`.

### UI Structure

The UI is divided into two main panels:

#### Left Panel

- **Input and Buttons**: Allows users to enter commands and send them to the backend. Also includes a clear button to reset the interface.
- **History Display**: Shows a scrollable history of commands and responses, styled to fit the retro theme.

#### Right Panel

- **CoordinatePlane Component**: Receives shapes as props and displays them. Styled to integrate visually with the rest of the interface.

### Style

- Uses a consistent beige background and brown text for a retro feel.
- Input and button elements are styled with matching colors and borders, enhancing the visual consistency.
- The back button is styled to be unobtrusive but becomes more prominent on hover, providing feedback and a clear path back to previous UI.

### Interaction

- Buttons include dynamic styles on hover and click, providing visual feedback.
- The `CoordinatePlane` component is a key interactive element, displaying graphical representations based on user input.

### Accessibility and Navigation

- All interactive elements are accessible via keyboard and mouse, and visual feedback is provided for hover states.
- Navigation between component views is managed via `useNavigate`, ensuring smooth transitions within the application's flow.

## Select Component

### Imports

- **React**: Importing React to use hooks and components.
- **useNavigate**: Importing `useNavigate` from `react-router-dom` for navigation.

### Component Structure

`Select` is a React component designed for selecting a level in the application. It uses a grid layout to display selectable levels.

### State Management

This component does not use local state but relies on navigation to manage application flow.

### Functions

- **navigate**: Used to navigate to a specific level's page or back to the previous page.

### UI Structure

#### Main Layout

- **Container Style**: Uses a flex column layout centered both horizontally and vertically. The container ensures the content is accessible and visually focused.
- **Header**: Displays the title "Select a Level" with significant emphasis.
  
#### Grid Layout

- **Levels**: Displays level buttons in a 3-column grid. Each button is styled to stand out against the black background.
  
### Style

- **General Styling**: Maintains a consistent retro aesthetic with 'Press Start 2P' font and high contrast color scheme (black and white).
- **Buttons**: Designed with visual feedback in mind. Hover effects include a box shadow and scale transformation to indicate interactivity.

### Interaction

- **Level Buttons**: Each button navigates to a detailed view for the selected level. Hover states enhance usability and visual appeal.
- **Back Button**: Provides a clear option to return to the previous page, with consistent styling and interaction effects as level buttons.

### Accessibility and Navigation

- All buttons are accessible via keyboard and provide visual feedback during interaction, ensuring a user-friendly experience across different input methods.

## CoordinatePlane Component

### Imports

- **React**: Importing React to use hooks and components.
- **useRef, useEffect**: Importing `useRef` to reference DOM elements and `useEffect` for side effects.

### Component Structure

`CoordinatePlane` is a React component that renders a customizable coordinate plane on a canvas, displaying various geometric shapes based on the provided props.

### Props

- **shapes**: An array of shape objects that describe the geometric figures to be drawn on the coordinate plane.

### Canvas Setup

- **canvasRef**: A ref attached to the canvas element to gain direct access to the DOM node.
- **useEffect Hook**: Contains all canvas drawing logic, which runs every time the `shapes` prop changes.

### Drawing Logic

#### Transformations

- **transform3DTo2D Function**: Converts 3D coordinates to 2D screen space using basic 3D projection mathematics.

#### Drawing Axes

- **drawAxes Function**: Draws the X, Y, and Z axes on the canvas to provide a reference for the shapes.

#### Drawing Shapes

- **drawShapes Function**: Iterates over the `shapes` array and draws each shape according to its type and parameters:
  - **Circles**: Uses parametric equations to create circles on specified construction planes.
  - **Rectangles**: Calculates corners based on width and height, adjusting for different planes (XY, XZ, YZ).

### Styles

- **Canvas**: Set with a fixed width and height, bordered to visually separate it from other UI elements.
- **Stroke Styles**: Different colors and widths for various shapes to enhance distinction.

### Performance Considerations

- Uses `useEffect` to limit re-rendering only to necessary updates, ensuring efficient redrawing when `shapes` changes.
- Clears the canvas before redrawing to prevent visual artifacts.

### Accessibility

- Canvas does not inherently support screen readers or keyboard navigation, but annotations or descriptions could be added as part of a more comprehensive accessibility strategy.

## CSS Stylesheet for App Component

### General Styles

#### .App

- **text-align**: Center aligns the content within the `.App` container, ensuring that all child elements are centered horizontally.

### Logo Animation

#### .App-logo

- **height**: Sets the logo height to 40% of the viewport's minimum dimension, scaling responsively with the viewport.
- **pointer-events**: Disables pointer events to ensure the logo does not interfere with user interactions.

#### @media (prefers-reduced-motion: no-preference)

- **animation**: Applies a continuous rotation animation to the `.App-logo` if the user has no preference for reduced motion. This animation makes the logo spin indefinitely with a duration of 20 seconds and a linear timing function.

### Header Styles

#### .App-header

- **background-color**: Sets a dark blue-grey color (`#282c34`) as the background for the header area.
- **min-height**: Ensures that the header takes up at least the full height of the viewport, creating a full-screen effect.
- **display**: Utilizes flexbox to manage layout and positioning of child elements.
- **flex-direction**: Sets the direction of the flex items as a column, stacking them vertically.
- **align-items**: Centers the flex items horizontally within the header.
- **justify-content**: Centers the flex items vertically, aiding in creating a centered and balanced layout.
- **font-size**: Dynamically adjusts the font size based on the viewport size, starting from a base of 10px plus 2% of the viewport's minimum dimension.
- **color**: Sets text color to white, ensuring high contrast against the dark background for readability.

### Link Styles

#### .App-link

- **color**: Uses a light blue color (`#61dafb`), providing a visual distinction for links and enhancing accessibility with a contrasting hue against the dark background.

### Keyframes Animation

#### @keyframes App-logo-spin

- **from**: Starts the rotation from 0 degrees.
- **to**: Ends the rotation at 360 degrees, completing a full circle. This keyframe animation creates a smooth, continuous spinning effect for the logo.

## Global CSS Styles

### Body Styles

#### body

- **margin**: Sets the margin of the body to 0 to remove the default margin provided by browsers, ensuring the content properly aligns to the edge of the viewport.
- **font-family**: Specifies a list of system fonts to be used across different operating systems and devices, ensuring a consistent and readable text display. This list includes:
  - `-apple-system` for newer Apple devices.
  - `BlinkMacSystemFont` for older Mac OS versions.
  - `Segoe UI` for Windows systems.
  - `Roboto`, `Oxygen`, `Ubuntu`, `Cantarell`, `Fira Sans`, `Droid Sans`, `Helvetica Neue` for various Linux distributions and preferences.
  - Generic `sans-serif` as a fallback if none of the specified fonts are available.
- **-webkit-font-smoothing**: Applies antialiasing to smooth the font on WebKit browsers, improving text readability.
- **-moz-osx-font-smoothing**: Applies grayscale antialiasing to smooth fonts specifically on macOS, optimizing text display for Firefox users.

### Code Styling

#### code

- **font-family**: Specifies a stack of monospaced fonts for elements styled with `<code>`, enhancing the readability of inline and block code elements. This includes:
  - `source-code-pro` as the primary choice for a clean, modern look.
  - Traditional monospaced fonts like `Menlo`, `Monaco`, `Consolas`, `Courier New` for broad compatibility across platforms.

### Keyframes Animation

#### @keyframes blink

- **0%, 50%**: Sets the opacity of the element to 1 (fully visible) at the start and mid-point of the animation cycle.
- **100%**: Sets the opacity to 0 (fully invisible) at the end of the cycle, creating a blinking effect. This is typically used to attract attention to specific elements like cursor indicators in text fields or important notifications.

