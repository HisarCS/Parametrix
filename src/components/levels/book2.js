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
    title: 'Creating a Simple Circle',
    content: 'Let\'s create a circle using parametric design.\n\nA circle is defined by one key parameter: its radius (the distance from the center to the edge).',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 5
  },
  {
    id: 'parametric-circle',
    title: 'Circle in Parametric Design',
    content: 'Circles are perfect for parametric design because they\'re controlled by a single number - the radius.\n\nThis makes them:\n- Easy to scale\n- Perfect for patterns\n- Great for repeated designs\n\nAll we need is:\n- Radius size\n- Position\n- Which plane to draw on',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 8
  },
  {
    id: 'command-format',
    title: 'The Circle Command',
    content: 'Our circle command looks like this:\n\ncircle radius 5 on XYConstructionPlane at (0,0,2)\n\nThis means:\n- Radius: 5 units\n- Draw on XY plane (like a paper)\n- Position: center at x=0, y=0, z=2 (2 units up)\n\nCompared to rectangles, notice:\n- Only one size parameter (radius)\n- Same positioning system\n- Same plane options',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 10
  },
  {
    id: 'json-structure',
    title: 'Circle JSON Structure',
    content: 'When we run our circle command, it creates this JSON:\n\n{\n  "shape": "circle",\n  "parameters": {\n    "radius": 5\n  },\n  "plane": "XYConstructionPlane",\n  "coordinates": [0, 0, 2]\n}\n\nNotice:\n- Shape type is "circle"\n- Parameters only need radius\n- Plane defines drawing surface\n- Coordinates position the center',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 10
  },
  {
    id: 'circle-properties',
    title: 'Understanding Circle Properties',
    content: 'A circle\'s properties are all based on its radius:\n\n- Diameter = 2 × radius\n- Circumference = 2 × π × radius\n- Area = π × radius²\n\nIn our example with radius 5:\n- Diameter = 10 units\n- Circumference ≈ 31.4 units\n- Area ≈ 78.5 square units\n\nThis shows how one parameter (radius) controls everything!',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 12
  },
  {
    id: 'positioning-circles',
    title: 'Positioning Circles in 3D',
    content: 'The coordinates (0,0,2) in our example mean:\n\nX = 0: Center left/right\n- Positive moves right\n- Negative moves left\n\nY = 0: Center forward/back\n- Positive moves forward\n- Negative moves back\n\nZ = 2: Two units up\n- Higher numbers move up\n- Lower numbers move down\n\nThe circle\'s center point is always at these coordinates.',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 10
  },
  {
    id: 'comparing-commands',
    title: 'Command and JSON Review',
    content: 'Let\'s compare the command and its JSON:\n\nCommand:\ncircle radius 5 on XYConstructionPlane at (0,0,2)\n\nBecomes:\n{\n  "shape": "circle",\n  "parameters": {\n    "radius": 5\n  },\n  "plane": "XYConstructionPlane",\n  "coordinates": [0, 0, 2]\n}\n\nEach part of the command has a clear place in the JSON structure.',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 8
  },
  {
    id: 'circle-variations',
    title: 'Creating Circle Variations',
    content: 'By changing our parameters, we can create different circles:\n\nBig circle:\ncircle radius 10 on XYConstructionPlane at (0,0,0)\n\nSmall circle up high:\ncircle radius 2 on XYConstructionPlane at (0,0,5)\n\nCircle off to the right:\ncircle radius 5 on XYConstructionPlane at (10,0,0)\n\nEach variation just needs changes to:\n- radius value\n- position coordinates',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 10
  },
  {
    id: 'final-thoughts',
    title: 'Circles in Parametric Design',
    content: 'Circles show the power of parametric design:\n\n1. Simple Control\n   - One number (radius) controls size\n   - Three numbers (x,y,z) control position\n\n2. Easy Modifications\n   - Change radius to resize\n   - Adjust coordinates to move\n   - Switch planes to reorient\n\n3. Consistent Structure\n   - Clear command format\n   - Organized JSON output\n   - Predictable behavior',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 10
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
