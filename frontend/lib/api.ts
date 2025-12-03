const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function getBackendHealth() {
  try {
    const response = await fetch(`${backendUrl}/`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch backend health:', error);
    throw error;
  }
}
