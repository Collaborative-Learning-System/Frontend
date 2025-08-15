import React, { useState, useEffect } from 'react';
import './QuizTaker.css';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: number;
  timeLimit: number;
  completed: boolean;
  score?: number;
  maxScore: number;
}

interface QuizTakerProps {
  quiz: Quiz;
  onComplete: (quizId: number, score: number, maxScore: number) => void;
  onBack: () => void;
}

const mockQuestions: { [key: number]: Question[] } = {
  1: [ // Network Security Basics
    {
      id: 1,
      question: "What does SSL stand for?",
      options: ["Secure Socket Layer", "Simple Socket Layer", "Secure System Layer", "Safe Socket Layer"],
      correctAnswer: 0
    },
    {
      id: 2,
      question: "Which port is commonly used for HTTPS?",
      options: ["80", "443", "22", "21"],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "What is a firewall primarily used for?",
      options: ["Data encryption", "Network traffic filtering", "Password management", "File compression"],
      correctAnswer: 1
    },
    {
      id: 4,
      question: "Which of the following is NOT a type of malware?",
      options: ["Virus", "Trojan", "Worm", "Firewall"],
      correctAnswer: 3
    },
    {
      id: 5,
      question: "What does VPN stand for?",
      options: ["Virtual Private Network", "Very Private Network", "Verified Private Network", "Visual Private Network"],
      correctAnswer: 0
    }
  ],
  2: [ // Cryptography Advanced
    {
      id: 6,
      question: "What is the key size of AES-256?",
      options: ["128 bits", "192 bits", "256 bits", "512 bits"],
      correctAnswer: 2
    },
    {
      id: 7,
      question: "Which is an example of asymmetric encryption?",
      options: ["AES", "DES", "RSA", "Blowfish"],
      correctAnswer: 2
    }
  ],
  4: [ // SDLC Fundamentals
    {
      id: 8,
      question: "What does SDLC stand for?",
      options: ["Software Development Life Cycle", "System Development Life Cycle", "Software Design Life Cycle", "System Design Life Cycle"],
      correctAnswer: 0
    },
    {
      id: 9,
      question: "Which phase comes first in the SDLC?",
      options: ["Design", "Implementation", "Requirements Analysis", "Testing"],
      correctAnswer: 2
    }
  ]
};

const QuizTaker: React.FC<QuizTakerProps> = ({ quiz, onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60); // Convert to seconds
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const questions = mockQuestions[quiz.id] || [];

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmitQuiz();
    }
  }, [timeLeft, quizCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    setScore(correctAnswers);
    setQuizCompleted(true);
    onComplete(quiz.id, correctAnswers, questions.length);
  };

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="quiz-result">
        <div className="result-header">
          <h2>Quiz Completed!</h2>
          <div className="score-display">
            <span className="score-number">{score}/{questions.length}</span>
            <span className="score-percentage">({percentage}%)</span>
          </div>
        </div>
        
        <div className="result-details">
          <p>You answered {score} out of {questions.length} questions correctly.</p>
          <div className="performance-indicator">
            {percentage >= 80 ? (
              <span className="excellent">🎉 Excellent work!</span>
            ) : percentage >= 60 ? (
              <span className="good">👍 Good job!</span>
            ) : (
              <span className="needs-improvement">📚 Keep studying!</span>
            )}
          </div>
        </div>
        
        <button className="back-btn" onClick={onBack}>
          Back to Quizzes
        </button>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="quiz-taker">
      <div className="quiz-taker-header">
        <div className="quiz-info">
          <h2>{quiz.title}</h2>
          <div className="quiz-progress">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
        
        <div className="quiz-timer">
          <span className="timer-icon">⏰</span>
          <span className="timer-text">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {currentQ && (
        <div className="question-container">
          <h3 className="question-text">{currentQ.question}</h3>
          
          <div className="options-container">
            {currentQ.options.map((option, index) => (
              <div
                key={index}
                className={`option ${selectedAnswers[currentQuestion] === index ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(index)}
              >
                <div className="option-indicator">
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="option-text">{option}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="quiz-navigation">
        <button 
          className="nav-btn prev-btn" 
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Previous
        </button>
        
        <button className="nav-btn back-btn" onClick={onBack}>
          Exit Quiz
        </button>
        
        {currentQuestion === questions.length - 1 ? (
          <button 
            className="nav-btn submit-btn"
            onClick={handleSubmitQuiz}
            disabled={selectedAnswers[currentQuestion] === undefined}
          >
            Submit Quiz
          </button>
        ) : (
          <button 
            className="nav-btn next-btn"
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestion] === undefined}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizTaker;
