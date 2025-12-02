### Story 1.2: Core Frontend Setup

As a developer,
I want the Next.js frontend to be set up and connected to a Vercel deployment pipeline,
So that I can build UI components and have continuous deployment.

**Acceptance Criteria:**

**Given** the project is initialized
**When** I set up the frontend
**Then** a Next.js app is created with TypeScript and Tailwind CSS
**And** a Vercel CI/CD pipeline is connected for automated deployments
**And** a basic API call from the frontend to the backend is successful

**Prerequisites:** Story 1.1

**Technical Notes:** Use `create-next-app` command, configure Tailwind, setup Vercel project, implement a simple test API call.
