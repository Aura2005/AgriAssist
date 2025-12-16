'use client';

import type { AgriAssistFormData, CropData, FertilizerData } from '@/lib/types';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { CropCard } from './CropCard';
import { Button } from '../ui/button';
import { RefreshCcw, Syringe } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface RecommendationResultsProps {
  state: {
    status: string;
    cropResults: CropData[] | null;
    selectedCrop: CropData | null;
    fertilizerResults: FertilizerData[] | null;
    error: string | null;
  };
  isLoading: boolean;
  onSelectFertilizer: (crop: CropData) => void;
  onReset: () => void;
}

export function RecommendationResults({ state, isLoading, onSelectFertilizer, onReset }: RecommendationResultsProps) {
  const { status, cropResults, selectedCrop, fertilizerResults } = state;

  const chartData = cropResults?.map(c => ({ crop: c.crop, score: Math.round(c.score * 100) })) || [];
  
  const chartConfig = {
    score: {
      label: 'Suitability',
      color: 'hsl(var(--primary))',
    },
  };

  const renderSkeletons = (count: number) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-24 w-full" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      
      {/* Crop Recommendations */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Top 3 Crop Recommendations</CardTitle>
          <CardDescription>Based on your input, these are the most suitable crops.</CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'loadingCrops' ? renderSkeletons(3) : (
            cropResults && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cropResults.map(crop => (
                  <CropCard
                    key={crop.crop}
                    crop={crop}
                    onSelectFertilizer={onSelectFertilizer}
                    isLoading={isLoading && selectedCrop?.crop !== crop.crop}
                    isSelected={selectedCrop?.crop === crop.crop}
                  />
                ))}
              </div>
            )
          )}
        </CardContent>
      </Card>
      
      {/* Suitability Chart and Fertilizer Results */}
      {(status === 'cropsSuccess' || status === 'loadingFertilizer' || status === 'fertilizerSuccess') && cropResults && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Crop Suitability Score</CardTitle>
                    <CardDescription>A comparison of the top recommended crops.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <ResponsiveContainer>
                        <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="crop" tickLine={false} tickMargin={10} axisLine={false} />
                            <YAxis domain={[0, 100]} unit="%" />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="score" fill="var(--color-score)" radius={4} />
                        </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>

            <Card className="shadow-lg">
                 <CardHeader>
                    <div className="flex items-center gap-2">
                      <Syringe className="text-accent" />
                      <CardTitle className="font-headline text-2xl">Fertilizer Recommendation</CardTitle>
                    </div>
                    <CardDescription>
                      {selectedCrop ? `For ${selectedCrop.crop}:` : 'Select a crop to see fertilizer recommendations.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {status === 'loadingFertilizer' && (
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                        </div>
                    )}
                    {(status === 'fertilizerSuccess' && fertilizerResults) && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Fertilizer</TableHead>
                                    <TableHead>Dosage</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fertilizerResults.map(f => (
                                    <TableRow key={f.fertilizer}>
                                        <TableCell className="font-medium">{f.fertilizer}</TableCell>
                                        <TableCell>{f.dosage}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                     {status !== 'loadingFertilizer' && !fertilizerResults && (
                        <div className="text-center text-muted-foreground py-8">
                            <p>Click "Get Fertilizer" on a crop card.</p>
                        </div>
                     )}
                </CardContent>
            </Card>
        </div>
      )}

      <div className="flex justify-center pt-4">
        <Button variant="outline" onClick={onReset} disabled={isLoading}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Start New Recommendation
        </Button>
      </div>

    </div>
  );
}
