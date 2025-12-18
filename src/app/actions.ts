'use server';

import { persistFavoritePlants } from '@/ai/flows/persist-favorite-plants';
import { AgriAssistFormData, CropData, FertilizerData } from '@/lib/types';

// --- Direct Logic Implementation (Replaces API calls) ---

const crops = [
  'rice', 'maize', 'jute', 'cotton', 'coconut', 'papaya', 'orange', 'apple',
  'muskmelon', 'watermelon', 'grapes', 'mango', 'banana', 'pomegranate',
  'lentil', 'blackgram', 'mungbean', 'mothbeans', 'pigeonpeas',
  'kidneybeans', 'chickpea', 'coffee'
];

const fertilizers = [
  { name: 'Urea', dosage: () => `${(Math.random() * 10 + 10).toFixed(0)}-${(Math.random() * 10 + 20).toFixed(0)} kg/acre` },
  { name: 'DAP (Diammonium Phosphate)', dosage: () => `${(Math.random() * 15 + 20).toFixed(0)}-${(Math.random() * 15 + 35).toFixed(0)} kg/acre` },
  { name: 'MOP (Muriate of Potash)', dosage: () => `${(Math.random() * 10 + 15).toFixed(0)}-${(Math.random() * 10 + 25).toFixed(0)} kg/acre` },
  { name: '10-26-26', dosage: () => `${(Math.random() * 20 + 30).toFixed(0)}-${(Math.random() * 20 + 50).toFixed(0)} kg/acre` },
  { name: 'Single Super Phosphate', dosage: () => `${(Math.random() * 25 + 40).toFixed(0)}-${(Math.random() * 25 + 65).toFixed(0)} kg/acre` },
  { name: 'Ammonium Sulphate', dosage: () => `${(Math.random() * 10 + 10).toFixed(0)}-${(Math.random() * 10 + 20).toFixed(0)} kg/acre` },
];

function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

async function predictCropsDirectly(data: AgriAssistFormData): Promise<CropData[]> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // data is available here if you need to use it for a real model
    // console.log("Predicting crops for data:", data);

    const shuffledCrops = shuffle([...crops]);
    const top3Crops = shuffledCrops.slice(0, 3).map(crop => ({
      crop: crop,
      score: Math.random() * (0.98 - 0.75) + 0.75,
    }));
    
    top3Crops.sort((a, b) => b.score - a.score);
    return top3Crops;
}

async function predictFertilizerDirectly(data: AgriAssistFormData, crop: string): Promise<FertilizerData[]> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // data and crop are available here if needed
    // console.log("Predicting fertilizer for crop:", crop, "with data:", data);

    const shuffledFertilizers = shuffle([...fertilizers]);
    const recommendedFertilizers = shuffledFertilizers.slice(0, 2).map(f => ({
        fertilizer: f.name,
        dosage: f.dosage()
    }));

    return recommendedFertilizers;
}


// --- Server Actions ---

export async function getCropRecommendations(
  data: AgriAssistFormData
): Promise<{ data?: CropData[]; error?: string }> {
  try {
    const result = await predictCropsDirectly(data);
    return { data: result };
  } catch (error) {
    console.error('Error in getCropRecommendations:', error);
    return { error: 'An unexpected error occurred while predicting crops.' };
  }
}

export async function getFertilizerRecommendation(
  data: AgriAssistFormData,
  crop: string
): Promise<{ data?: FertilizerData[]; error?: string }> {
  try {
    const result = await predictFertilizerDirectly(data, crop);
    return { data: result };
  } catch (error) {
    console.error('Error in getFertilizerRecommendation:', error);
    return { error: 'An unexpected error occurred while predicting fertilizer.' };
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
    const tempRequest = fetch(`${BLYNK_SERVER_URL}/get?token=${blynkToken}&pin=${pins.temperature}`).then(res => {
        if (!res.ok) throw new Error('Failed to fetch temperature. Check if device is online.');
        return res.json();
    });
    const humidityRequest = fetch(`${BLYNK_SERVER_URL}/get?token=${blynkToken}&pin=${pins.humidity}`).then(res => {
        if (!res.ok) throw new Error('Failed to fetch humidity. Check if device is online.');
        return res.json();
    });
    const rainfallRequest = fetch(`${BLYNK_SERVER_URL}/get?token=${blynkToken}&pin=${pins.rainfall}`).then(res => {
        if (!res.ok) throw new Error('Failed to fetch rainfall. Check if device is online.');
        return res.json();
    });

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

  } catch (error: any) {
    console.error("Blynk API error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch data from Blynk. Please check your token and device status.';
    return { error: errorMessage };
  }
}
