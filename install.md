
## Prerequisites

Ensure you have the following installed:
- Node.js and npm (latest LTS version recommended)
- Python 3.8 or higher
- Julia 1.6 or higher

## Frontend Setup (React)

### Core React Packages
```bash
npm install react@19.0.0 react-dom@19.0.0 react-scripts@5.0.1 react-router-dom@6.15.0
```

These packages provide:
- `react`: Core React library
- `react-dom`: DOM-specific methods for React
- `react-scripts`: Configuration and scripts for Create React App
- `react-router-dom`: Routing capabilities for React applications

### Testing Libraries
```bash
npm install @testing-library/react@14.0.0 @testing-library/jest-dom@6.1.3 @testing-library/user-event@14.5.1
```

This suite includes:
- React Testing Library for component testing
- Jest DOM for DOM testing utilities
- User Event for simulating user interactions in tests

### Visualization and 3D Rendering
```bash
npm install @react-three/fiber@9.0.0-rc.4 recharts@2.8.0
```

Provides:
- React Three Fiber for 3D graphics
- Recharts for data visualization and charting

### Data Handling and Utilities
```bash
npm install axios@1.5.0 lodash@4.17.21 mathjs@11.11.0 papaparse@5.4.1 xlsx@0.18.5
```

These utilities offer:
- Axios: HTTP client for API requests
- Lodash: JavaScript utility functions
- Math.js: Advanced mathematics library
- Papa Parse: CSV parsing
- XLSX: Excel file handling

### UI Components
```bash
npm install lucide-react@0.263.1
```

Provides Lucide icons for React applications.

## Backend Setup (Python/Flask)

Create a virtual environment first:
```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

Install Python packages:
```bash
pip install flask==2.3.3
pip install flask-cors==4.0.0
pip install transformers==4.33.1
pip install numpy==1.25.2
pip install torch==2.0.1
pip install requests==2.31.0
pip install python-dotenv==1.0.0
```

This includes:
- Flask: Web framework
- Flask-CORS: Cross-origin resource sharing
- Transformers: NLP capabilities
- NumPy: Numerical computations
- PyTorch: Machine learning
- Requests: HTTP library
- python-dotenv: Environment variable management

## Julia Setup

Launch Julia and install packages:

```julia
using Pkg

# Method 1: Add packages individually
Pkg.add("HTTP")
Pkg.add("JSON3")
Pkg.add("LinearAlgebra")
Pkg.add("Dates")

# Method 2: Add all packages at once
Pkg.add(["HTTP", "JSON3", "LinearAlgebra", "Dates"])
```

These packages provide:
- HTTP: Web requests and API interactions
- JSON3: Modern JSON parsing
- LinearAlgebra: Mathematical operations
- Dates: Date and time functionality

## Version Compatibility Notes

- The React packages use version 19.0.0, which is a significant upgrade from React 18
- Flask 2.3.3 requires Python 3.8 or higher
- PyTorch 2.0.1 may require specific CUDA versions for GPU support
- Julia packages will automatically resolve to compatible versions

## Post-Installation Verification

After installation, verify the setup:

1. React: Create a new component and test the imports
2. Python: Start Flask server and verify endpoints
3. Julia: Test package imports in REPL

Contact support or check documentation if you encounter any issues during installation.
