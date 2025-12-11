import React from 'react';

interface QuestionPromptProps {
  question: string;
}

const QuestionPrompt: React.FC<QuestionPromptProps> = ({ question }) => {
  return (
    <h1 className="text-3xl font-bold mb-6 text-white text-center">
      {question}
    </h1>
  );
};

export default QuestionPrompt;