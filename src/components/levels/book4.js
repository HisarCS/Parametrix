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
    title: 'Creating a Triangle',
    content: 'Let\'s create a triangle using parametric design.\n\nA triangle is defined by three sides:\n- Side 1 length\n- Side 2 length\n- Side 3 length\n\nNote: The sides must be able to form a valid triangle!',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 5
  },
  {
    id: 'triangle-parameters',
    title: 'Triangle Parameters',
    content: 'A triangle needs three numbers that follow this rule:\n\nAny two sides added together must be greater than the third side.\n\nFor example, these work:\n- 3, 4, 5 (right triangle)\n- 5, 5, 5 (equilateral)\n- 5, 6, 7 (scalene)\n\nBut these don\'t:\n- 1, 2, 10 (impossible to close)\n- 3, 3, 6 (can\'t form triangle)',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 8
  },
  {
    id: 'command-format',
    title: 'The Triangle Command',
    content: 'Our triangle command looks like this:\n\ntriangle 3 4 5 on XYConstructionPlane at (0,1,1)\n\nThis means:\n- Side 1: 3 units\n- Side 2: 4 units\n- Side 3: 5 units\n- Draw on XY plane\n- Position: center at x=0, y=1, z=1',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 10
  },
  {
    id: 'json-structure',
    title: 'Triangle JSON Structure',
    content: 'The command creates this JSON:\n\n{\n  "shape": "triangle",\n  "parameters": {\n    "side1": 3,\n    "side2": 4,\n    "side3": 5\n  },\n  "plane": "XYConstructionPlane",\n  "coordinates": [0, 1, 1]\n}\n\nNotice:\n- Shape type is "triangle"\n- Parameters include all three sides\n- Plane determines drawing surface\n- Coordinates position the center',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 10
  },
  {
    id: 'special-triangles',
    title: 'Special Triangle Types',
    content: 'Different side combinations create different triangles:\n\nRight Triangle:\ntriangle 3 4 5 on XYConstructionPlane at (0,0,0)\n\nEquilateral Triangle:\ntriangle 5 5 5 on XYConstructionPlane at (0,0,0)\n\nIsosceles Triangle:\ntriangle 5 5 7 on XYConstructionPlane at (0,0,0)\n\nEach type has special properties but uses the same command format.',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 12
  },
  {
    id: 'positioning',
    title: 'Positioning Triangles',
    content: 'The coordinates (0,1,1) position the triangle\'s center:\n\nX = 0: Center left/right\n- Positive moves right\n- Negative moves left\n\nY = 1: One unit forward\n- Positive moves forward\n- Negative moves back\n\nZ = 1: One unit up\n- Higher numbers move up\n- Lower numbers move down',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 8
  },
  {
    id: 'plane-importance',
    title: 'Understanding Triangle Planes',
    content: 'The construction plane affects how your triangle is oriented:\n\nXYConstructionPlane:\n- Triangle lies flat like on a table\n- Height is in Z direction\n\nYZConstructionPlane:\n- Triangle stands up like on a wall\n- Height is in Y direction\n\nZXConstructionPlane:\n- Triangle stands sideways\n- Height is in Z direction',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 10
  },
  {
    id: 'final',
    title: 'Triangle Review',
    content: 'Let\'s review our triangle creation:\n\nCommand:\ntriangle 3 4 5 on XYConstructionPlane at (0,1,1)\n\nCreates JSON:\n{\n  "shape": "triangle",\n  "parameters": {\n    "side1": 3,\n    "side2": 4,\n    "side3": 5\n  },\n  "plane": "XYConstructionPlane",\n  "coordinates": [0, 1, 1]\n}\n\nKey points:\n- Three sides define the shape\n- Sides must form valid triangle\n- Plane controls orientation\n- Coordinates place the center',
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
