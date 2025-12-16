import { NextResponse } from 'next/server';

const fertilizers = [
  { name: 'Urea', dosage: () => `${(Math.random() * 10 + 10).toFixed(0)}-${(Math.random() * 10 + 20).toFixed(0)} kg/acre` },
  { name: 'DAP (Diammonium Phosphate)', dosage: () => `${(Math.random() * 15 + 20).toFixed(0)}-${(Math.random() * 15 + 35).toFixed(0)} kg/acre` },
  { name: 'MOP (Muriate of Potash)', dosage: () => `${(Math.random() * 10 + 15).toFixed(0)}-${(Math.random() * 10 + 25).toFixed(0)} kg/acre` },
  { name: '10-26-26', dosage: () => `${(Math.random() * 20 + 30).toFixed(0)}-${(Math.random() * 20 + 50).toFixed(0)} kg/acre` },
  { name: 'Single Super Phosphate', dosage: () => `${(Math.random() * 25 + 40).toFixed(0)}-${(Math.random() * 25 + 65).toFixed(0)} kg/acre` },
  { name: 'Ammonium Sulphate', dosage: () => `${(Math.random() * 10 + 10).toFixed(0)}-${(Math.random() * 10 + 20).toFixed(0)} kg/acre` },
];


function shuffle(array: any[]) {
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
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const body = await request.json();
    if (!body || !body.crop) {
      return NextResponse.json({ error: 'Crop not provided' }, { status: 400 });
    }

    const shuffledFertilizers = shuffle([...fertilizers]);
    const recommendedFertilizers = shuffledFertilizers.slice(0, 2).map(f => ({
        fertilizer: f.name,
        dosage: f.dosage()
    }));

    return NextResponse.json(recommendedFertilizers);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}
