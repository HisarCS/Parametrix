// book1.js
import React from 'react';
import PropTypes from 'prop-types';

// Constants
export const PageTypes = {
  CONTENT: 'CONTENT',
  EXERCISE: 'EXERCISE',
  QUIZ: 'QUIZ',
  CODE: 'CODE'
};

export const DifficultyLevels = {
  BEGINNER: 'BEGINNER',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED'
};

// Define default pages
const defaultPages = [
  {
    id: 'intro',
    title: 'Welcome to Parametrix Tutorial',
    content: 'Building Simple Rectangle\n\nHere at Parametrix we\'ll learn how to create basic shapes through parameters and controls.',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 5
  },
  {
    id: 'workspace',
    title: 'Understanding Our Building Space',
    content: 'XY Plane is like a piece of paper:\n- X: Left/Right\n- Y: Forward/Back\n- Z: Up/Down\n\nThis is where we\'ll start building.',
    pageType: PageTypes.CONTENT,
    difficulty: DifficultyLevels.BEGINNER,
    requiredTime: 10
  },
  {
    id: 'parameters',
    title: 'Parameters for a Rectangle',
    content: 'A rectangle needs:\n- Width (how long)\n- Height (how tall)\n- Position (where to place it)\n- Plane (which surface to draw on)',
    pageType: PageTypes.EXERCISE,
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
