// frontend/src/components/dashboard/DayNavigator.tsx
import React from 'react';

interface DayNavigatorProps {
  selectedDay: string;
  onDayChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const DayNavigator: React.FC<DayNavigatorProps> = ({ selectedDay, onDayChange }) => {
  return (
    <div className="text-center mb-6">
      <label htmlFor="day-selector" className="mr-2 text-gray-300">View a different day:</label>
      <select
        id="day-selector"
        value={selectedDay}
        onChange={onDayChange}
        className="bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
          <option key={day} value={day}>{day}</option>
        ))}
      </select>
    </div>
  );
};

export default DayNavigator;
