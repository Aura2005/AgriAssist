'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { CropData } from '@/lib/types';
import { Badge } from '../ui/badge';
import { Loader2, Sparkles, Star, Syringe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveFavoritePlant } from '@/app/actions';
import { useState, useTransition } from 'react';

interface CropCardProps {
  crop: CropData;
  onSelectFertilizer: (crop: CropData) => void;
  isLoading: boolean;
  isSelected: boolean;
}

export function CropCard({ crop, onSelectFertilizer, isLoading, isSelected }: CropCardProps) {
  const { toast } = useToast();
  const [isSaving, startSavingTransition] = useTransition();

  const image = PlaceHolderImages.find(img => img.id === crop.crop.toLowerCase()) || PlaceHolderImages.find(img => img.id === 'default');
  
  const handleSaveFavorite = () => {
    startSavingTransition(async () => {
      const result = await saveFavoritePlant(crop.crop);
      if(result.success) {
        toast({
          title: 'Favorite Saved!',
          description: `${crop.crop} has been added to your favorites.`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message,
        });
      }
    });
  };

  return (
    <Card className={`flex flex-col transition-all duration-300 ${isSelected ? 'border-primary ring-2 ring-primary' : ''}`}>
      <CardHeader className="p-0 relative">
        {image && (
          <Image
            src={image.imageUrl}
            alt={image.description}
            data-ai-hint={image.imageHint}
            width={600}
            height={400}
            className="rounded-t-lg aspect-[3/2] object-cover"
          />
        )}
        <Badge className="absolute top-2 right-2 text-base" variant="secondary">
          {Math.round(crop.score * 100)}% Match
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 pt-4">
        <CardTitle className="capitalize font-headline text-xl">{crop.crop}</CardTitle>
      </CardContent>
      <CardFooter className="flex-col sm:flex-row gap-2">
        <Button onClick={() => onSelectFertilizer(crop)} disabled={isLoading} className="w-full" variant={isSelected ? 'default' : 'secondary'}>
          {isLoading && isSelected ? (
             <>
             <Loader2 className="animate-spin" />
             Loading...
           </>
          ) : (
            <>
              <Syringe />
              Get Fertilizer
            </>
          )}
        </Button>
        <Button variant="ghost" size="icon" onClick={handleSaveFavorite} disabled={isSaving}>
            {isSaving ? <Loader2 className="animate-spin"/> : <Star className="text-accent/80 hover:text-accent hover:fill-accent/20" />}
            <span className="sr-only">Save as favorite</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
