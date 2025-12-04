'use client';

import React from 'react';

interface DietaryPreferencesProps {
  onPreferenceChange: (preference: string[]) => void;
  selectedPreferences: string[];
}

const DietaryPreferences: React.FC<DietaryPreferencesProps> = ({ onPreferenceChange, selectedPreferences }) => {
  const preferences = ['Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Gluten-Free', 'None'];

  const handleToggle = (preference: string) => {
    if (preference === 'None') {
      onPreferenceChange(selectedPreferences.includes('None') ? [] : ['None']);
      return;
    }

    let newSelections = [];
    if (selectedPreferences.includes('None')) {
      newSelections = [preference];
    } else {
      newSelections = selectedPreferences.includes(preference)
        ? selectedPreferences.filter((p) => p !== preference)
        : [...selectedPreferences, preference];
    }
    onPreferenceChange(newSelections.filter(p => p !== 'None')); // Ensure 'None' is exclusive
  };

  return (
    <div className="text-white">
      <h3 className="text-xl font-semibold mb-4 text-center">Do you have any dietary preferences?</h3>
      <div className="grid grid-cols-1 gap-4">
        {preferences.map((preference) => (
          <button
            key={preference}
            onClick={() => handleToggle(preference)}
            className={`p-4 rounded-lg text-lg font-medium transition-colors duration-200 
              ${selectedPreferences.includes(preference) ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            {preference}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DietaryPreferences;
