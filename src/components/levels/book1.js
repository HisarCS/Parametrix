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
    title: 'Creating a Simple Rectangle',
    content: 'Let\'s create a single rectangle with width 4 and height 6.\n\nParametric design means we can control shapes through numbers and relationships.',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 5
  },
  {
    id: 'parametric-design',
    title: 'What is Parametric Design?',
    content: 'Parametric design lets us create shapes using numbers (parameters) that we can easily change.\n\nInstead of drawing directly, we give instructions like:\n- How wide?\n- How tall?\n- Where to place it?\n\nThis makes it easy to:\n- Make precise adjustments\n- Create variations quickly\n- Control shapes through relationships',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 8
  },
  {
    id: 'coordinate-system',
    title: 'Understanding the 3D Space',
    content: 'We use three coordinates (x,y,z) to position things in 3D space:\n\nX-axis: Left/Right\n- Positive numbers go right\n- Negative numbers go left\n- 0 is center\n\nY-axis: Forward/Back\n- Positive numbers go forward\n- Negative numbers go back\n- 0 is center\n\nZ-axis: Up/Down\n- Positive numbers go up\n- Negative numbers go down\n- 0 is ground level',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 10
  },
  {
    id: 'position-examples',
    title: 'Common Coordinate Positions',
    content: 'Here are some useful coordinate positions:\n\n(0,0,0): Center point\n(5,0,0): 5 units right\n(0,5,0): 5 units forward\n(0,0,5): 5 units up\n(5,5,0): 5 right and 5 forward\n(5,5,5): 5 right, 5 forward, 5 up\n\nThink of it like:\n- First number: how far left/right\n- Second number: how far forward/back\n- Third number: how far up/down',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 8
  },
  {
    id: 'command-format',
    title: 'The Rectangle Command',
    content: 'Our rectangle command will be:\n\nrectangle 4 6 on XYConstructionPlane at (1,2,0)\n\nThis means:\n- Width: 4 units\n- Height: 6 units\n- On the XY plane (like a piece of paper)\n- Position: 1 right, 2 forward, at ground level',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 8
  },
  {
    id: 'json-result',
    title: 'The JSON Output',
    content: 'When we run our command, it creates this JSON:\n\n{\n  "shape": "rectangle",\n  "parameters": {\n    "width": 4,\n    "height": 6\n  },\n  "plane": "XYConstructionPlane",\n  "coordinates": [1, 2, 0]\n}\n\nThis JSON has:\n- Shape type (rectangle)\n- Size parameters (width and height)\n- Drawing plane (XY)\n- Position coordinates ([1,2,0])',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 10
  },
  {
    id: 'parameters-explained',
    title: 'Understanding Parameters',
    content: 'Parameters are the numbers that control our shape:\n\nSize Parameters:\n- width: controls how wide the rectangle is\n- height: controls how tall it is\n\nPosition Parameters:\n- x: controls left/right position\n- y: controls forward/back position\n- z: controls up/down position\n\nChanging these numbers lets us:\n- Make the rectangle bigger or smaller\n- Move it to different positions\n- Create variations easily',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 10
  },
  {
    id: 'why-parametric',
    title: 'Why Use Parametric Design?',
    content: 'Parametric design is powerful because:\n\n1. Easy Changes\n   - Just change numbers\n   - No need to redraw\n   - Quick adjustments\n\n2. Precise Control\n   - Exact measurements\n   - Consistent results\n   - No guesswork\n\n3. Reusability\n   - Save commands\n   - Create variations\n   - Build libraries\n\n4. Automation\n   - Create multiple shapes\n   - Apply patterns\n   - Build complex designs',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 12
  },
  {
    id: 'final',
    title: 'Putting It All Together',
    content: 'Let\'s review our rectangle:\n\nCommand:\nrectangle 4 6 on XYConstructionPlane at (1,2,0)\n\nThis uses parametric design by:\n- Defining exact size (4x6)\n- Specifying precise position (1,2,0)\n- Using clear parameters\n\nThe JSON structure captures all this information:\n{\n  "shape": "rectangle",\n  "parameters": {\n    "width": 4,\n    "height": 6\n  },\n  "plane": "XYConstructionPlane",\n  "coordinates": [1, 2, 0]\n}\n\nThis combination of:\n- Parametric control\n- Coordinate positioning\n- Structured data\n\nMakes it easy to create and modify shapes precisely.',
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
