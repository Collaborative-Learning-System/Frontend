import React, { useState } from 'react';
import QuizTaker from './QuizTaker';
import './Quiz.css';

interface Quiz {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: number;
  timeLimit: number; // in minutes
  completed: boolean;
  score?: number;
  maxScore: number;
}

interface QuizProps {
  groupId: number;
}

const mockQuizzes: { [key: number]: Quiz[] } = {
  1: [ // Computer Security
    {
      id: 1,
      title: 'Network Security Basics',
      description: 'Test your knowledge of network security fundamentals',
      difficulty: 'easy',
      questions: 10,
      timeLimit: 15,
      completed: true,
      score: 8,
      maxScore: 10
    },
    {
      id: 2,
      title: 'Cryptography Advanced',
      description: 'Advanced concepts in cryptography and encryption',
      difficulty: 'hard',
      questions: 15,
      timeLimit: 25,
      completed: false,
      maxScore: 15
    },
    {
      id: 3,
      title: 'Web Application Security',
      description: 'Common vulnerabilities and security measures',
      difficulty: 'medium',
      questions: 12,
      timeLimit: 20,
      completed: true,
      score: 10,
      maxScore: 12
    }
  ],
  2: [ // Software Engineering
    {
      id: 4,
      title: 'SDLC Fundamentals',
      description: 'Software Development Life Cycle basics',
      difficulty: 'easy',
      questions: 8,
      timeLimit: 12,
      completed: false,
      maxScore: 8
    },
    {
      id: 5,
      title: 'Design Patterns',
      description: 'Common software design patterns and their applications',
      difficulty: 'medium',
      questions: 14,
      timeLimit: 22,
      completed: true,
      score: 11,
      maxScore: 14
    }
  ],
  3: [ // Business Analysis
    {
      id: 6,
      title: 'Requirements Gathering',
      description: 'Techniques for gathering and analyzing requirements',
      difficulty: 'medium',
      questions: 10,
      timeLimit: 18,
      completed: false,
      maxScore: 10
    }
  ]
};

const Quiz: React.FC<QuizProps> = ({ groupId }) => {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [quizzes, setQuizzes] = useState(mockQuizzes[groupId] || []);

  const handleQuizComplete = (quizId: number, score: number, maxScore: number) => {
    setQuizzes(prev => prev.map(quiz => 
      quiz.id === quizId 
        ? { ...quiz, completed: true, score }
        : quiz
    ));
    setSelectedQuiz(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#52c41a';
      case 'medium': return '#faad14';
      case 'hard': return '#f5222d';
      default: return '#1890ff';
    }
  };

  if (selectedQuiz) {
    return (
      <QuizTaker 
        quiz={selectedQuiz} 
        onComplete={handleQuizComplete}
        onBack={() => setSelectedQuiz(null)}
      />
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>Available Quizzes</h2>
        <p>Test your knowledge with these quizzes</p>
      </div>

      <div className="quiz-grid">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="quiz-card">
            <div className="quiz-card-header">
              <h3 className="quiz-title">{quiz.title}</h3>
              <span 
                className="difficulty-badge"
                style={{ backgroundColor: getDifficultyColor(quiz.difficulty) }}
              >
                {quiz.difficulty.toUpperCase()}
              </span>
            </div>
            
            <p className="quiz-description">{quiz.description}</p>
            
            <div className="quiz-meta">
              <div className="quiz-info">
                <span>📝 {quiz.questions} questions</span>
                <span>⏰ {quiz.timeLimit} min</span>
              </div>
              
              {quiz.completed && (
                <div className="quiz-score">
                  Score: {quiz.score}/{quiz.maxScore} ({Math.round((quiz.score! / quiz.maxScore) * 100)}%)
                </div>
              )}
            </div>
            
            <div className="quiz-actions">
              {quiz.completed ? (
                <button 
                  className="quiz-btn retake-btn"
                  onClick={() => setSelectedQuiz(quiz)}
                >
                  Retake Quiz
                </button>
              ) : (
                <button 
                  className="quiz-btn take-btn"
                  onClick={() => setSelectedQuiz(quiz)}
                >
                  Take Quiz
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {quizzes.length === 0 && (
        <div className="no-quizzes">
          <p>No quizzes available for this group yet.</p>
        </div>
      )}
    </div>
  );
};

export default Quiz;
