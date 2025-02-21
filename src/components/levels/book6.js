// book1.js
import React from 'react';
import PropTypes from 'prop-types';

export const PageTypes = {
  CONTENT: 'CONTENT'
};

export const DifficultyLevels = {
  BEGINNER: 'BEGINNER'
};

const defaultPages = [
  {
    id: 'intro',
    title: 'House Construction: Understanding Our Project',
    content: 'We\'ll build a complete house using parametric design.\n\nFinal Structure Elements:\n1. Main body (rectangle)\n2. Roof (triangle)\n3. Door with knob (rectangle + circle)\n4. Two windows with panes (multiple rectangles)\n\nCoordinate System:\n- Origin (0,0,0) at house center\n- X: Left (-) to Right (+)\n- Y: Down (-) to Up (+)\n- Z: Back (-) to Front (+)\n\nUnit System:\n- All measurements relative to house width (20 units)\n- Proportional relationships maintained\n- Consistent scale throughout design',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 10
  },
  {
    id: 'proportion-planning',
    title: 'Understanding Key Proportions',
    content: 'Before we start building, let\'s understand our proportions:\n\nMain Structure (20×15):\n- Width: 20 units total\n  * Door: 4 units (20%)\n  * Windows: 3 units each (15%)\n  * Spacing: Remaining 50%\n\n- Height: 15 units total\n  * Door: 8 units\n  * Windows: 3 units\n  * Top space: 4 units\n\nThis creates a balanced facade with:\n- Golden ratio approximation\n- Natural-looking proportions\n- Proper element spacing',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 12
  },
  {
    id: 'main-structure',
    title: 'Creating the Main Structure',
    content: 'Command:\nrectangle 20 15 on XYConstructionPlane at (0,0,0)\n\nJSON Output:\n{\n  "shape": "rectangle",\n  "parameters": {\n    "width": 20,\n    "height": 15\n  },\n  "plane": "XYConstructionPlane",\n  "coordinates": [0, 0, 0]\n}\n\nKey Points:\n1. Centered at origin\n2. Width enables proper spacing\n3. Height accommodates all elements\n4. Creates foundation for design',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 10
  },
  {
    id: 'roof-design',
    title: 'Roof Design Principles',
    content: 'The roof requires careful consideration:\n\nProportions:\n- Base matches house width (20 units)\n- Equal sides for symmetry\n- Height determined by equilateral triangle\n\nPosition:\n- Centered on house (x=0)\n- Touches top of main structure\n- Y-coordinate calculation:\n  * House height = 15\n  * House center = 0\n  * Top = 15/2 = 7.5\n\nThis creates classic house profile.',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 12
  },
  {
    id: 'roof-creation',
    title: 'Creating the Roof',
    content: 'Command:\ntriangle 20 20 20 on XYConstructionPlane at (0,7.5,0)\n\nJSON Output:\n{\n  "shape": "triangle",\n  "parameters": {\n    "side1": 20,\n    "side2": 20,\n    "side3": 20\n  },\n  "plane": "XYConstructionPlane",\n  "coordinates": [0, 7.5, 0]\n}\n\nWhy These Values:\n1. Equal sides for perfect symmetry\n2. Width matches house\n3. Y=7.5 places at house top',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 10
  },
  {
    id: 'door-design',
    title: 'Door Design Principles',
    content: 'Door proportions and positioning:\n\nSize Ratios:\n- Width: 4 units (20% of house)\n- Height: 8 units (standard door)\n- Knob: 0.3 units radius\n\nPositioning:\n- Centered horizontally (x=0)\n- Bottom aligned with house\n- Y calculation:\n  * House center = 0\n  * House height = 15\n  * Door height = 8\n  * Y offset = -3.5\n\nThis creates natural entrance.',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 12
  },
  {
    id: 'door-creation',
    title: 'Creating the Door',
    content: 'Door Commands:\nrectangle 4 8 on XYConstructionPlane at (0,-3.5,0)\ncircle radius 0.3 on XYConstructionPlane at (1.5,-3,0)\n\nDoor JSON:\n{\n  "shape": "rectangle",\n  "parameters": {\n    "width": 4,\n    "height": 8\n  },\n  "plane": "XYConstructionPlane",\n  "coordinates": [0, -3.5, 0]\n}\n\nKnob JSON:\n{\n  "shape": "circle",\n  "parameters": {\n    "radius": 0.3\n  },\n  "plane": "XYConstructionPlane",\n  "coordinates": [1.5, -3, 0]\n}',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 10
  },
  {
    id: 'window-design',
    title: 'Window Design Principles',
    content: 'Window design considerations:\n\nMain Frame:\n- Size: 3×3 units (square)\n- Position: ±6 units from center\n- Height: 2 units above center\n\nPane Division:\n- Vertical: 1.5 units wide\n- Horizontal: 1.5 units high\n- Creates four equal sections\n\nThis creates classic window look.',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 12
  },
  {
    id: 'left-window',
    title: 'Creating Left Window',
    content: 'Left Window Commands:\n// Main Frame\nrectangle 3 3 on XYConstructionPlane at (-6,2,0)\n\n// Vertical Panes\nrectangle 1.5 3 on XYConstructionPlane at (-6.75,2,0)\nrectangle 1.5 3 on XYConstructionPlane at (-5.25,2,0)\n\n// Horizontal Panes\nrectangle 3 1.5 on XYConstructionPlane at (-6,2.75,0)\nrectangle 3 1.5 on XYConstructionPlane at (-6,1.25,0)',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 15
  },
  {
    id: 'left-window-json',
    title: 'Left Window JSON Structure',
    content: 'Main Frame JSON:\n{\n  "shape": "rectangle",\n  "parameters": {\n    "width": 3,\n    "height": 3\n  },\n  "plane": "XYConstructionPlane",\n  "coordinates": [-6, 2, 0]\n}\n\nVertical Pane JSON (example):\n{\n  "shape": "rectangle",\n  "parameters": {\n    "width": 1.5,\n    "height": 3\n  },\n  "plane": "XYConstructionPlane",\n  "coordinates": [-6.75, 2, 0]\n}\n\nHorizontal Pane JSON (example):\n{\n  "shape": "rectangle",\n  "parameters": {\n    "width": 3,\n    "height": 1.5\n  },\n  "plane": "XYConstructionPlane",\n  "coordinates": [-6, 2.75, 0]\n}',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 12
  },
  {
    id: 'right-window',
    title: 'Creating Right Window',
    content: 'Right Window Commands:\n// Main Frame\nrectangle 3 3 on XYConstructionPlane at (6,2,0)\n\n// Vertical Panes\nrectangle 1.5 3 on XYConstructionPlane at (5.25,2,0)\nrectangle 1.5 3 on XYConstructionPlane at (6.75,2,0)\n\n// Horizontal Panes\nrectangle 3 1.5 on XYConstructionPlane at (6,2.75,0)\nrectangle 3 1.5 on XYConstructionPlane at (6,1.25,0)',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 15
  },
  {
    id: 'right-window-json',
    title: 'Right Window JSON Structure',
    content: 'Main Frame JSON:\n{\n  "shape": "rectangle",\n  "parameters": {\n    "width": 3,\n    "height": 3\n  },\n  "plane": "XYConstructionPlane",\n  "coordinates": [6, 2, 0]\n}\n\nVertical Pane JSON (example):\n{\n  "shape": "rectangle",\n  "parameters": {\n    "width": 1.5,\n    "height": 3\n  },\n  "plane": "XYConstructionPlane",\n  "coordinates": [5.25, 2, 0]\n}\n\nHorizontal Pane JSON (example):\n{\n  "shape": "rectangle",\n  "parameters": {\n    "width": 3,\n    "height": 1.5\n  },\n  "plane": "XYConstructionPlane",\n  "coordinates": [6, 2.75, 0]\n}',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 12
  },
  {
    id: 'symmetry-check',
    title: 'Understanding Symmetry',
    content: 'Key Symmetry Points:\n\n1. Vertical Center Line (x=0)\n   - Door centered\n   - Roof peak aligned\n   - Equal window spacing\n\n2. Window Positions\n   - Left: x = -6\n   - Right: x = +6\n   - Same y-coordinates\n   - Identical pane structure\n\n3. Balanced Elements\n   - Equal distances from center\n   - Matching sizes\n   - Consistent spacing',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 10
  },
  {
    id: 'coordinate-system',
    title: 'Coordinate System Deep Dive',
    content: 'Understanding Our 3D Space:\n\n1. X-Axis Positioning\n   - Negative: Left of center\n   - Positive: Right of center\n   - Zero: Center line\n\n2. Y-Axis Positioning\n   - Negative: Below center\n   - Positive: Above center\n   - Zero: Vertical midpoint\n\n3. Z-Axis Positioning\n   - All at zero for 2D facade\n   - Ready for 3D expansion\n   - Maintains alignment',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 10
  },
  {
    id: 'measurements',
    title: 'Understanding Measurements',
    content: 'Key Measurements Review:\n\n1. Main Structure\n   - Width: 20 units\n   - Height: 15 units\n\n2. Roof\n   - All sides: 20 units\n   - Position: y=7.5\n\n3. Door\n   - Width: 4 units\n   - Height: 8 units\n   - Knob: 0.3 radius\n\n4. Windows\n   - Frame: 3×3 units\n   - Panes: 1.5 unit divisions\n   - Position: ±6 from center',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 10
  },
  {
    id: 'final-integration',
    title: 'Complete House Review',
    content: 'Final Structure Overview:\n\n1. Component Count\n   - 1 main rectangle\n   - 1 triangle roof\n   - 1 door rectangle\n   - 1 door knob circle\n   - 2 window frames\n   - 8 window panes\n   Total: 14 shapes\n\n2. Key Alignments\n   - Centered door\n   - Symmetric windows\n   - Proportional roof\n\n3. Spacing Distribution\n   - Even window placement\n   - Balanced door size\n   - Natural proportions\n\nThis creates a complete, well-proportioned house facade.',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 15
  }
];
// Book base component
export class Book extends React.Component {
  static propTypes = {
    pages: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      pageType: PropTypes.oneOf(Object.values(PageTypes)).isRequired,
      difficulty: PropTypes.oneOf(Object.values(DifficultyLevels)).isRequired,
      requiredTime: PropTypes.number,
      dependencies: PropTypes.arrayOf(PropTypes.string),
      solutions: PropTypes.arrayOf(PropTypes.string),
      validations: PropTypes.arrayOf(PropTypes.func)
    })).isRequired,
    settings: PropTypes.shape({
      allowSkip: PropTypes.bool,
      trackProgress: PropTypes.bool,
      showHints: PropTypes.bool,
      enforcePrerequisites: PropTypes.bool
    }).isRequired,
    onPageComplete: PropTypes.func,
    onBookComplete: PropTypes.func,
    onExerciseSubmit: PropTypes.func
  };

  constructor(props) {
    super(props);
    
    if (!props.pages || props.pages.length === 0) {
      throw new Error('Book requires at least one page');
    }

    this.state = {
      currentPageIndex: 0,
      completedPages: new Set(),
      userAnswers: new Map(),
      startTime: Date.now(),
      pageStartTime: Date.now()
    };
  }

  goToPage = (pageIndex) => {
    const { pages, settings } = this.props;
    const targetPage = pages[pageIndex];

    if (settings.enforcePrerequisites && targetPage.dependencies) {
      const hasCompletedPrereqs = targetPage.dependencies.every(
        depId => this.state.completedPages.has(depId)
      );
      
      if (!hasCompletedPrereqs) {
        console.warn('Prerequisites not met for page:', targetPage.id);
        return false;
      }
    }

    this.setState({
      currentPageIndex: pageIndex,
      pageStartTime: Date.now()
    });

    return true;
  };

  nextPage = () => {
    const { currentPageIndex } = this.state;
    const { pages } = this.props;
    
    if (currentPageIndex < pages.length - 1) {
      return this.goToPage(currentPageIndex + 1);
    }
    return false;
  };

  previousPage = () => {
    const { currentPageIndex } = this.state;
    if (currentPageIndex > 0) {
      return this.goToPage(currentPageIndex - 1);
    }
    return false;
  };

  markPageComplete = (pageId) => {
    this.setState(prevState => ({
      completedPages: new Set([...prevState.completedPages, pageId])
    }), () => {
      const { onPageComplete, onBookComplete, pages } = this.props;
      
      if (onPageComplete) {
        onPageComplete(pageId);
      }

      if (this.state.completedPages.size === pages.length && onBookComplete) {
        onBookComplete({
          totalTime: Date.now() - this.state.startTime,
          completedPages: Array.from(this.state.completedPages)
        });
      }
    });
  };

  handleSubmission = (pageId, answer) => {
    const { pages, onExerciseSubmit } = this.props;
    const page = pages.find(p => p.id === pageId);
    
    if (!page) return false;

    this.setState(prevState => ({
      userAnswers: new Map(prevState.userAnswers.set(pageId, answer))
    }));

    let isCorrect = true;
    if (page.validations) {
      isCorrect = page.validations.every(validation => validation(answer));
    }

    if (isCorrect) {
      this.markPageComplete(pageId);
    }

    if (onExerciseSubmit) {
      onExerciseSubmit({
        pageId,
        answer,
        isCorrect,
        timeSpent: Date.now() - this.state.pageStartTime
      });
    }

    return isCorrect;
  };

  render() {
    const { currentPageIndex, completedPages } = this.state;
    const { pages, settings } = this.props;
    const currentPage = pages[currentPageIndex];

    return (
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: 'blue',
        color: 'white',
        fontFamily: "'Press Start 2P', cursive"
      }}>
        {/* Page Content */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2>{currentPage.title}</h2>
            <span>Page {currentPageIndex + 1} of {pages.length}</span>
          </div>

          <div style={{ whiteSpace: 'pre-wrap', marginBottom: '20px' }}>
            {currentPage.content}
          </div>

          {currentPage.pageType !== PageTypes.CONTENT && (
            <div>
              {settings.showHints && currentPage.hints && (
                <div style={{ 
                  marginBottom: '20px',
                  padding: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }}>
                  <h3>Hints:</h3>
                  <ul>
                    {currentPage.hints.map((hint, index) => (
                      <li key={index}>{hint}</li>
                    ))}
                  </ul>
                </div>
              )}

              <textarea
                onChange={(e) => this.setState({ currentAnswer: e.target.value })}
                placeholder="Enter your answer..."
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '10px',
                  backgroundColor: 'white',
                  color: 'blue',
                  fontFamily: "'Press Start 2P', cursive"
                }}
              />
              
              <button
                onClick={() => this.handleSubmission(currentPage.id, this.state.currentAnswer)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'white',
                  color: 'blue',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Press Start 2P', cursive"
                }}
              >
                Submit
              </button>
            </div>
          )}

          {completedPages.has(currentPage.id) && (
            <div style={{
              marginTop: '20px',
              padding: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }}>
              ✓ Completed
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginTop: '20px'
        }}>
          <button
            onClick={this.previousPage}
            disabled={currentPageIndex === 0}
            style={{
              padding: '10px 20px',
              backgroundColor: 'white',
              color: 'blue',
              border: 'none',
              cursor: currentPageIndex === 0 ? 'not-allowed' : 'pointer',
              opacity: currentPageIndex === 0 ? 0.5 : 1,
              fontFamily: "'Press Start 2P', cursive"
            }}
          >
            Previous
          </button>
          
          {settings.allowSkip && (
            <button
              onClick={this.nextPage}
              disabled={currentPageIndex === pages.length - 1}
              style={{
                padding: '10px 20px',
                backgroundColor: 'white',
                color: 'blue',
                border: 'none',
                cursor: currentPageIndex === pages.length - 1 ? 'not-allowed' : 'pointer',
                opacity: currentPageIndex === pages.length - 1 ? 0.5 : 1,
                fontFamily: "'Press Start 2P', cursive"
              }}
            >
              {currentPageIndex === pages.length - 1 ? 'Finish' : 'Next'}
            </button>
          )}
        </div>
      </div>
    );
  }
}

// Book1 component that uses the Book component with default configuration
const Book1 = () => {
  const settings = {
    allowSkip: true,
    trackProgress: true,
    showHints: true,
    enforcePrerequisites: false
  };

  return (
    <Book
      pages={defaultPages}
      settings={settings}
      onPageComplete={(pageId) => console.log(`Completed page: ${pageId}`)}
      onBookComplete={(stats) => console.log('Book completed!', stats)}
      onExerciseSubmit={(result) => console.log('Exercise submitted:', result)}
    />
  );
};

export default Book1;
