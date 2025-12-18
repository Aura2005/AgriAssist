'use server';

import { persistFavoritePlants } from '@/ai/flows/persist-favorite-plants';
import { AgriAssistFormData, CropData, FertilizerData } from '@/lib/types';

const getApiUrl = (path: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9002';
  return `${baseUrl}${path}`;
};


export async function getCropRecommendations(
  data: AgriAssistFormData
): Promise<{ data?: CropData[]; error?: string }> {
  try {
    const response = await fetch(getApiUrl('/api/predict-crop'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || 'Failed to fetch crop recommendations' };
    }

    const result: CropData[] = await response.json();
    return { data: result };
  } catch (error) {
    console.error('Error in getCropRecommendations:', error);
    return { error: 'An unexpected error occurred.' };
  }
}

export async function getFertilizerRecommendation(
  data: AgriAssistFormData,
  crop: string
): Promise<{ data?: FertilizerData[]; error?: string }> {
  try {
    const response = await fetch(getApiUrl('/api/predict-fertilizer'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, crop }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || 'Failed to fetch fertilizer recommendations' };
    }

    const result: FertilizerData[] = await response.json();
    return { data: result };
  } catch (error) {
    console.error('Error in getFertilizerRecommendation:', error);
    return { error: 'An unexpected error occurred.' };
  }
}

export async function saveFavoritePlant(plantName: string): Promise<{ success: boolean; message: string }> {
  try {
    const result = await persistFavoritePlants({
      userId: 'anonymous-user', // In a real app, this would come from user session
      plantName,
    });
    return result;
  } catch (error) {
    console.error('Error saving favorite plant:', error);
    return { success: false, message: 'Failed to save favorite plant.' };
  }
}

export async function getBlynkData(blynkToken: string): Promise<{ data?: Partial<AgriAssistFormData>; error?: string }> {
  const BLYNK_SERVER_URL = 'https://blynk.cloud/external/api';
  // V1: temperature, V2: humidity, V3: rain
  const pins = {
    temperature: 'v1',
    humidity: 'v2',
    rainfall: 'v3',
  };

  try {
    const tempRequest = fetch(`${BLYNK_SERVER_URL}/get?token=${blynkToken}&${pins.temperature}`).then(res => res.ok ? res.json() : Promise.reject('Failed to fetch temperature'));
    const humidityRequest = fetch(`${BLYNK_SERVER_URL}/get?token=${blynkToken}&${pins.humidity}`).then(res => res.ok ? res.json() : Promise.reject('Failed to fetch humidity'));
    const rainfallRequest = fetch(`${BLYNK_SERVER_URL}/get?token=${blynkToken}&${pins.rainfall}`).then(res => res.ok ? res.json() : Promise.reject('Failed to fetch rainfall'));

    const [temperature, humidity, rainfall] = await Promise.all([
      tempRequest,
      humidityRequest,
      rainfallRequest
    ]);
    
    const data: Partial<AgriAssistFormData> = {
      temperature,
      humidity,
      rainfall,
    };

    return { data };

  } catch (error) {
    console.error("Blynk API error:", error);
    return { error: 'Failed to fetch data from Blynk. Please check your token and device status.' };
  }
}
