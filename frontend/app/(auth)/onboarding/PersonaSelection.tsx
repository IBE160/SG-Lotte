'use client';

import React from 'react';

interface PersonaSelectionProps {
  onPersonaSelect: (persona: string) => void;
  selectedPersona: string | null;
}

const PersonaSelection: React.FC<PersonaSelectionProps> = ({ onPersonaSelect, selectedPersona }) => {
  const personas = ['Beginner', 'Intermediate', 'Advanced', 'Athlete'];

  return (
    <div className="text-white">
      <h3 className="text-xl font-semibold mb-4 text-center">Which fitness persona best describes you?</h3>
      <div className="grid grid-cols-1 gap-4">
        {personas.map((persona) => (
          <button
            key={persona}
            onClick={() => onPersonaSelect(persona)}
            className={`p-4 rounded-lg text-lg font-medium transition-colors duration-200 
              ${selectedPersona === persona ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            {persona}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PersonaSelection;
