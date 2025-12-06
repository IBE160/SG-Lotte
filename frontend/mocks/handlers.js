import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock for logging a workout
  http.post('/api/v1/plans/log-workout', async ({ request }) => {
    const newPost = await request.json();
    if (!newPost.workout_plan_id || !newPost.status) {
      return new HttpResponse(JSON.stringify({ detail: 'Invalid request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return HttpResponse.json({ message: 'Workout logged successfully.' }, { status: 201 });
  }),

  // Mock for getting today's workout
  http.get('/api/v1/plans/today', () => {
    return HttpResponse.json({
      plan_id: 'mock_plan_id',
      session: {
        day_of_week: 'Thursday',
        focus: 'Mock Pull Day',
        exercises: [
          { id: '1', name: 'Pull Ups', sets: 3, reps: '8-12', rest_time_seconds: 60, notes: null, completedSets: 0, totalSets: 3, icon: 'fitness_center', status: 'pending', difficulty: null },
          { id: '2', name: 'Bent Over Rows', sets: 4, reps: '10', rest_time_seconds: 60, notes: 'Keep back straight', completedSets: 0, totalSets: 4, icon: 'fitness_center', status: 'pending', difficulty: null },
        ],
      },
    });
  }),
];
