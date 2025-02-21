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
    title: 'Building a Clock Tower',
    content: 'Let\'s create a clock tower with classic proportions.\n\nOur tower will have:\n- Strong base\n- Detailed clock section\n- Simple spire top\n- Basic entrance\n\nWe\'ll use a coordinate system where:\n- Center is (0,0,0)\n- Positive Y is up\n- Negative Y is down\n- X is left/right',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 5
  },
  {
    id: 'base',
    title: 'Creating the Base',
    content: 'Let\'s start with a solid foundation:\n\nBase Commands:\n\n// Main tower\nrectangle 12 40 on XYConstructionPlane at (0,0,0)\n\n// Foundation steps\nrectangle 16 2 on XYConstructionPlane at (0,-19,0)\nrectangle 14 2 on XYConstructionPlane at (0,-17,0)\n\n// Entrance\nrectangle 4 8 on XYConstructionPlane at (0,-15,0)\n\nThis creates:\n- Tall main structure\n- Two-step base\n- Simple entrance',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 10
  },
  {
    id: 'clock-section',
    title: 'Adding the Clock Section',
    content: 'Now for the clock housing:\n\nCommands:\n\n// Clock housing\nrectangle 16 16 on XYConstructionPlane at (0,12,0)\n\n// Clock face\ncircle radius 6 on XYConstructionPlane at (0,12,0)\n\n// Center point\ncircle radius 0.3 on XYConstructionPlane at (0,12,0)\n\n// Clock hands\nrectangle 0.6 4 on XYConstructionPlane at (0,12,0)  // Hour hand\nrectangle 0.4 5 on XYConstructionPlane at (0,12,0)  // Minute hand',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 12
  },
  {
    id: 'clock-details',
    title: 'Clock Face Details',
    content: 'Let\'s add hour markers:\n\n// Main hour markers (12, 3, 6, 9)\nrectangle 0.4 1.5 on XYConstructionPlane at (0,16,0)  // 12\nrectangle 0.4 1.5 on XYConstructionPlane at (4,12,0)  // 3\nrectangle 0.4 1.5 on XYConstructionPlane at (0,8,0)   // 6\nrectangle 0.4 1.5 on XYConstructionPlane at (-4,12,0) // 9\n\n// Optional: decorative circle\ncircle radius 6.5 on XYConstructionPlane at (0,12,0)',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 10
  },
  {
    id: 'windows',
    title: 'Adding Windows',
    content: 'Let\'s add simple windows:\n\nCommands:\n\n// Lower windows\nrectangle 2 6 on XYConstructionPlane at (-3,-5,0)\nrectangle 2 6 on XYConstructionPlane at (3,-5,0)\n\n// Upper windows\nrectangle 2 6 on XYConstructionPlane at (-3,5,0)\nrectangle 2 6 on XYConstructionPlane at (3,5,0)',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 8
  },
  {
    id: 'top-section',
    title: 'Creating the Top',
    content: 'Finally, let\'s add the top section:\n\nCommands:\n\n// Spire base\nrectangle 14 4 on XYConstructionPlane at (0,22,0)\n\n// Main spire\ntriangle 14 16 16 on XYConstructionPlane at (0,32,0)\n\n// Optional: small pinnacles\ntriangle 2 4 4 on XYConstructionPlane at (-6,24,0)\ntriangle 2 4 4 on XYConstructionPlane at (6,24,0)',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 10
  },
  {
    id: 'decoration',
    title: 'Simple Decorative Elements',
    content: 'Add basic decoration:\n\nCommands:\n\n// Horizontal bands\nrectangle 14 1 on XYConstructionPlane at (0,0,0)\nrectangle 14 1 on XYConstructionPlane at (0,20,0)\n\n// Door top\ncircle radius 2 on XYConstructionPlane at (0,-11,0)\n\nThese simple elements add architectural interest.',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 8
  },
  {
    id: 'final',
    title: 'Complete Tower Review',
    content: 'Our clock tower includes:\n\n1. Structure\n   - 40-unit main body\n   - 16×16 clock section\n   - 16-unit spire\n\n2. Details\n   - Stepped base\n   - Clock with hands\n   - Hour markers\n   - Windows\n   - Simple decorations\n\nAll elements work together for a classic tower appearance.',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 5
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
