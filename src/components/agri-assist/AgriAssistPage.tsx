'use client';

import React, { useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { AgriAssistFormData, CropData, FertilizerData } from '@/lib/types';
import { getCropRecommendations, getFertilizerRecommendation } from '@/app/actions';
import { InputForm } from './InputForm';
import { RecommendationResults } from './RecommendationResults';

type Status = 'idle' | 'loadingCrops' | 'cropsSuccess' | 'loadingFertilizer' | 'fertilizerSuccess' | 'error';

interface AgriAssistState {
  status: Status;
  formData: AgriAssistFormData | null;
  cropResults: CropData[] | null;
  selectedCrop: CropData | null;
  fertilizerResults: FertilizerData[] | null;
  error: string | null;
}

const initialState: AgriAssistState = {
  status: 'idle',
  formData: null,
  cropResults: null,
  selectedCrop: null,
  fertilizerResults: null,
  error: null,
};

export default function AgriAssistPage() {
  const [state, setState] = useState<AgriAssistState>(initialState);
  const [isTransitioning, startTransition] = useTransition();
  const { toast } = useToast();

  const handleFormSubmit = (data: AgriAssistİstFormData) => {
    startTransition(async () => {
      setState({ ...initialState, status: 'loadingCrops', formData: data });
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
    setState(initialState);
  };
  
  const isLoading = state.status === 'loadingCrops' || state.status === 'loadingFertilizer' || isTransitioning;

  return (
    <div className="space-y-8">
      <InputForm onSubmit={handleFormSubmit} isLoading={isLoading} />
      
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
