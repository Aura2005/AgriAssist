'use client';

import React, { useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { AgriAssistFormData, CropData, FertilizerData } from '@/lib/types';
import { getBlynkData, getCropRecommendations, getFertilizerRecommendation } from '@/app/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Zap } from 'lucide-react';
import { RecommendationResults } from '../agri-assist/RecommendationResults';
import { InputForm } from '../agri-assist/InputForm';

type Status = 
  | 'idle' 
  | 'loadingBlynk' 
  | 'blynkSuccess' 
  | 'manualInput'
  | 'loadingCrops' 
  | 'cropsSuccess' 
  | 'loadingFertilizer' 
  | 'fertilizerSuccess' 
  | 'error';

interface BlynkState {
  status: Status;
  blynkToken: string;
  formData: AgriAssistFormData | null;
  cropResults: CropData[] | null;
  selectedCrop: CropData | null;
  fertilizerResults: FertilizerData[] | null;
  error: string | null;
}

const initialState: BlynkState = {
  status: 'idle',
  blynkToken: 'rBx2c-9dpkwh2QYT1BpIO3eM_8_tLe5i',
  formData: null,
  cropResults: null,
  selectedCrop: null,
  fertilizerResults: null,
  error: null,
};

export default function BlynkIntegrationPage() {
  const [state, setState] = useState<BlynkState>(initialState);
  const [isTransitioning, startTransition] = useTransition();
  const { toast } = useToast();

  const handleFetchFromBlynk = () => {
    if (!state.blynkToken) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Please enter your Blynk Device Token.',
        });
        return;
    }

    startTransition(async () => {
        setState(s => ({ ...s, status: 'loadingBlynk', error: null }));
        const result = await getBlynkData(state.blynkToken);
        if (result.error) {
            setState(s => ({ ...s, status: 'error', error: result.error }));
            toast({
                variant: 'destructive',
                title: 'Blynk Error',
                description: result.error,
            });
        } else {
            // Fill missing data with default values from the main page
            const partialFormData: AgriAssistFormData = {
                nitrogen: 90,
                phosphorus: 42,
                potassium: 43,
                temperature: result.data?.temperature ?? 20.87,
                humidity: result.data?.humidity ?? 82.00,
                ph: 6.50,
                rainfall: result.data?.rainfall ?? 202.93,
            };
            setState(s => ({ ...s, status: 'blynkSuccess', formData: partialFormData, cropResults: null, fertilizerResults: null }));
            toast({
                title: 'Success!',
                description: 'Successfully fetched data from Blynk. You can now get recommendations.',
            });
        }
    });
  }

  const handleFormSubmit = (data: AgriAssistFormData) => {
    startTransition(async () => {
      setState(s => ({ ...s, status: 'loadingCrops', formData: data, cropResults: null, fertilizerResults: null, selectedCrop: null }));
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
    setState(s => ({...initialState, blynkToken: s.blynkToken}));
  };
  
  const isLoading = state.status.startsWith('loading') || isTransitioning;
  const showResults = state.status !== 'idle' && state.status !== 'loadingBlynk' && state.status !== 'manualInput' && !isLoading;

  return (
    <div className="space-y-8">
      <Card className="w-full shadow-lg border-primary/20">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Fetch Data from Blynk</CardTitle>
          <CardDescription>Enter your Blynk device token to automatically fetch sensor data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input 
              placeholder="Your Blynk Device Token"
              value={state.blynkToken}
              onChange={(e) => setState(s => ({ ...s, blynkToken: e.target.value }))}
              disabled={isLoading}
              className="flex-grow"
            />
            <Button onClick={handleFetchFromBlynk} disabled={isLoading} className="w-full sm:w-auto">
              {state.status === 'loadingBlynk' ? (
                <>
                  <Loader2 className="animate-spin" /> Fetching...
                </>
              ) : (
                <>
                  <Zap /> Fetch Data
                </>
              )}
            </Button>
          </div>
           <div className="relative flex items-center">
            <div className="flex-grow border-t border-muted"></div>
            <span className="flex-shrink mx-4 text-muted-foreground text-sm">OR</span>
            <div className="flex-grow border-t border-muted"></div>
          </div>
           <Button variant="secondary" onClick={() => setState(s => ({...s, status: 'manualInput', formData: null, cropResults: null, fertilizerResults: null}))} disabled={isLoading} className="w-full">
            Enter Data Manually
          </Button>
        </CardContent>
      </Card>

      {(state.status === 'blynkSuccess' || state.status === 'manualInput') && state.formData && (
        <InputForm onSubmit={handleFormSubmit} isLoading={isLoading} />
      )}

      {(state.status !== 'idle' && state.status !== 'loadingBlynk' && state.status !== 'manualInput') && (
        <RecommendationResults
          state={{
            status: state.status,
            cropResults: state.cropResults,
            selectedCrop: state.selectedCrop,
            fertilizerResults: state.fertilizerResults,
            error: state.error,
          }}
          isLoading={isLoading}
          onSelectFertilizer={handleFertilizerRequest}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
