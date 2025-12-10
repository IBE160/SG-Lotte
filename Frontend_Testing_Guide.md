We've already set up a testing framework for the frontend using **Jest** and **React Testing Library**.

Here's how you can run the tests:

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Run the test command:**
    ```bash
    npm test
    ```

This command executes all the test files in the project.

### Where are the tests?

*   We've already created a sample test for the home page here: `frontend/app/__tests__/page.test.tsx`
*   The convention is to create a `__tests__` directory within the folder containing the component you want to test. For example, a test for `frontend/app/components/MyComponent.tsx` would go in `frontend/app/components/__tests__/MyComponent.test.tsx`.

### What do the current tests do?

The existing test (`page.test.tsx`) does two things:
1.  It "renders" the main home page component in a simulated browser environment.
2.  It checks if the heading "AI Fitness & Meal Planner" is present on the page.
3.  It also mocks the backend API call and verifies that the component correctly displays the mocked success message ("Backend status: ok").

This setup allows you to test your components' behavior and appearance without needing to run the full application in a browser.