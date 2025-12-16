import { NextResponse } from 'next/server';

const crops = [
  'rice', 'maize', 'jute', 'cotton', 'coconut', 'papaya', 'orange', 'apple',
  'muskmelon', 'watermelon', 'grapes', 'mango', 'banana', 'pomegranate',
  'lentil', 'blackgram', 'mungbean', 'mothbeans', 'pigeonpeas',
  'kidneybeans', 'chickpea', 'coffee'
];

function shuffle(array: string[]) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

export async function POST(request: Request) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate some processing with request data
    const body = await request.json();
    if (!body) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    const shuffledCrops = shuffle([...crops]);
    const top3Crops = shuffledCrops.slice(0, 3).map(crop => ({
      crop: crop,
      score: Math.random() * (0.98 - 0.75) + 0.75, // Random score between 0.75 and 0.98
    }));
    
    top3Crops.sort((a, b) => b.score - a.score);

    return NextResponse.json(top3Crops);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}
