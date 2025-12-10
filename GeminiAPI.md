The `GEMINI_API_KEY` should not be exposed on the frontend.
All frontend environment variables should be prefixed with `NEXT_PUBLIC_` and stored in a `.env.local` file.
The backend should handle all Gemini API calls.
The frontend should call the backend to access Gemini functionality.
This is to prevent exposing the secret `GEMINI_API_KEY` to the public.
