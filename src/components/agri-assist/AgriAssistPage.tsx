'use client';

import React, { useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { AgriAssistFormData, CropData, FertilizerData } from '@/lib/types';
import { getCropRecommendations, getFertilizerRecommendation } from '@/app/actions';
import { InputForm } from './InputForm';
import { RecommendationResults } from './RecommendationResults';
import { initialRecommendationPrompt } from '@/ai/flows/initial-recommendation-prompt';
import { Card, CardContent, CardDescription, CardHeader } from '../ui/card';
import { Sparkles } from 'lucide-react';

type Status = 'idle' | 'loadingCrops' | 'cropsSuccess' | 'loadingFertilizer' | 'fertilizerSuccess' | 'error';

interface AgriAssistState {
  status: Status;
  formData: AgriAssistFormData | null;
  cropResults: CropData[] | null;
  selectedCrop: CropData | null;
  fertilizerResults: FertilizerData[] | null;
  error: string | null;
  introGuide: string | null;
}

const initialState: AgriAssistState = {
  status: 'idle',
  formData: null,
  cropResults: null,
  selectedCrop: null,
  fertilizerResults: null,
  error: null,
  introGuide: null,
};

export default function AgriAssistPage() {
  const [state, setState] = useState<AgriAssistState>(initialState);
  const [isTransitioning, startTransition] = useTransition();
  const { toast } = useToast();

  React.useEffect(() => {
    // Fetch the initial guide for the user on component mount.
    async function fetchGuide() {
      try {
        const response = await initialRecommendationPrompt({});
        setState(s => ({ ...s, introGuide: response.recommendationGuide }));
      } catch (e) {
        console.error("Failed to fetch recommendation guide:", e);
        // Silently fail, the user can still use the form.
      }
    }
    fetchGuide();
  }, []);

  const handleFormSubmit = (data: AgriAssistFormData) => {
    startTransition(async () => {
      setState({ ...initialState, status: 'loadingCrops', formData: data, introGuide: state.introGuide });
      const result = await getCropRecommendations(data);
      if (result.error) {
        setState(s => ({ ...s, status: 'error', error: result.error }));
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      } else {
        setState(s => ({ ...s, status: 'cropsSuccess', cropResults: result.data || null }));
      }
    });
  };

  const handleFertilizerRequest = (crop: CropData) => {
    if (!state.formData) return;
    startTransition(async () => {
      setState(s => ({ ...s, status: 'loadingFertilizer', selectedCrop: crop, fertilizerResults: null }));
      const result = await getFertilizerRecommendation(state.formData!, crop.crop);
      if (result.error) {
        setState(s => ({ ...s, status: 'error', error: result.error }));
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      } else {
        setState(s => ({ ...s, status: 'fertilizerSuccess', fertilizerResults: result.data || null }));
      }
    });
  };

  const handleReset = () => {
    setState({...initialState, introGuide: state.introGuide});
  };
  
  const isLoading = state.status === 'loadingCrops' || state.status === 'loadingFertilizer' || isTransitioning;

  return (
    <div className="space-y-8">
      <InputForm onSubmit={handleFormSubmit} isLoading={isLoading} />
      
      {state.status === 'idle' && !isLoading && state.introGuide && (
        <Card className="bg-accent/20 border-accent/50 animate-in fade-in-50 duration-500">
            <CardHeader className="flex-row items-start gap-3">
                <Sparkles className="text-accent h-8 w-8 mt-1"/>
                <div>
                    <h2 className="text-xl font-headline text-accent-foreground/90">Getting Started</h2>
                    <CardDescription className="text-accent-foreground/70">
                    How to get the best recommendations
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-accent-foreground/80 whitespace-pre-wrap">{state.introGuide}</p>
            </CardContent>
        </Card>
      )}

      {(state.status !== 'idle' || isLoading) && (
        <RecommendationResults
          state={state}
          isLoading={isLoading}
          onSelectFertilizer={handleFertilizerRequest}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
