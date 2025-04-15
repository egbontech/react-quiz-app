import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { questions as allQuestions } from "./../data/questions";

function shuffleAndPickFive(arr: typeof allQuestions) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 5);
}

export default function Quiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState(() =>
    shuffleAndPickFive(allQuestions)
  );
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleAnswer = (selectedOption: string) => {
    setSelectedAnswer(selectedOption);
    const correct = selectedOption === currentQuestion.answer;

    if (correct) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const handleNext = () => {
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex < quizQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(null); // Reset for next question
    } else {
      setShowResult(true); // Quiz complete
    }
  };

  const restartQuiz = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setShowResult(false);
    setQuizQuestions(shuffleAndPickFive(allQuestions));
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-[#001e4d] flex items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-lg max-w-xl w-full p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Quiz Completed!</h1>
          <p className="text-lg mb-6">
            Your score: <strong>{score}</strong> out of {quizQuestions.length}
          </p>
          <button
            onClick={restartQuiz}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#001e4d] flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg max-w-lg w-full p-6">
        <h1 className="text-2xl font-bold mb-4 text-[#001e4d]">Simple Quiz</h1>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex} // triggers animation on question change
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <h2 className="text-xl font-semibold mb-3">
              {currentQuestion.question}
            </h2>

            <div className="grid gap-6 mt-6">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === option;

                return (
                  <button
                    onClick={() => handleAnswer(option)}
                    key={index}
                    disabled={!!selectedAnswer}
                    className={`px-4 py-3 rounded-lg cursor-pointer text-xl hover:bg-blue-200 bg-gray-200 text-left ${
                      isSelected ? "bg-green-300" : ""
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            <div className="my-8 flex items-center flex-col justify-center gap-3">
              <div className="flex gap-4">
                {selectedAnswer && (
                  <button
                    onClick={handleNext}
                    className="px-8 py-2 bg-[#001e4d] text-white text-xl rounded-sm cursor-pointer"
                  >
                    Next
                  </button>
                )}
              </div>

              <div className="text-sm text-gray-600 text-center">
                Question {currentQuestionIndex + 1} of {quizQuestions.length}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
