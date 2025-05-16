/**
 * Fetches publication data from the dashboard API endpoint
 * @returns Parsed data from the CSV file via the API
 */
export async function fetchPublicationData<T>(): Promise<T[]> {
  try {
    const response = await fetch('/api/dashboard/csv');
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data as T[];
  } catch (error) {
    console.error('Error fetching publication data:', error);
    throw new Error('Failed to fetch publication data');
  }
}
