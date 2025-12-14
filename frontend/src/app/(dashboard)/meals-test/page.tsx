// frontend/src/app/(dashboard)/meals-test/page.tsx
'use client';

import MealLoggingCard from '../meals/MealLoggingCard'; // Adjust path as necessary
import React from 'react'; // Import React for JSX

export default function MealsTestPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Temporary MealLoggingCard Test Page</h1>

      <div className="space-y-4">
        <MealLoggingCard
          meal_plan_id={101}
          meal_name="Breakfast Oats with Berries"
          initialStatus={null}
        />
        <MealLoggingCard
          meal_plan_id={102}
          meal_name="Lunch Chicken Salad"
          initialStatus="Eaten"
        />
        <MealLoggingCard
          meal_plan_id={103}
          meal_name="Dinner Salmon and Veggies"
          initialStatus="Skipped"
        />
      </div>
    </div>
  );
}
