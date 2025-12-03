export async function getBackendHealth() {
  try {
    const response = await fetch('http://localhost:8000/');
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
