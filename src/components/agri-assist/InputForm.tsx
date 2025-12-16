'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AgriAssistFormData, AgriAssistFormSchema } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Droplets, Loader2, Sparkles, Thermometer, Wind } from 'lucide-react';
import { KIonIcon, NIonIcon, PHIcon, PIonIcon } from '../icons';
import { Separator } from '../ui/separator';

interface InputFormProps {
  onSubmit: (data: AgriAssistFormData) => void;
  isLoading: boolean;
}

const formFields: { name: keyof AgriAssistFormData; label: string; icon: React.ElementType; placeholder: string, unit: string }[] = [
    { name: 'nitrogen', label: 'Nitrogen (N)', icon: NIonIcon, placeholder: 'e.g., 90', unit: 'kg/ha' },
    { name: 'phosphorus', label: 'Phosphorus (P)', icon: PIonIcon, placeholder: 'e.g., 42', unit: 'kg/ha' },
    { name: 'potassium', label: 'Potassium (K)', icon: KIonIcon, placeholder: 'e.g., 43', unit: 'kg/ha' },
    { name: 'temperature', label: 'Temperature', icon: Thermometer, placeholder: 'e.g., 20.8', unit: '°C' },
    { name: 'humidity', label: 'Humidity', icon: Droplets, placeholder: 'e.g., 82', unit: '%' },
    { name: 'ph', label: 'Soil pH', icon: PHIcon, placeholder: 'e.g., 6.5', unit: '' },
    { name: 'rainfall', label: 'Rainfall', icon: Wind, placeholder: 'e.g., 202.9', unit: 'mm' },
];


export function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const form = useForm<AgriAssistFormData>({
    resolver: zodResolver(AgriAssistFormSchema),
    defaultValues: {
      nitrogen: 90,
      phosphorus: 42,
      potassium: 43,
      temperature: 20.87,
      humidity: 82.00,
      ph: 6.50,
      rainfall: 202.93,
    },
  });

  return (
    <Card className="w-full shadow-lg border-primary/20">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Soil & Weather Conditions</CardTitle>
            <CardDescription>Enter the details below to get crop recommendations.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
              {formFields.map(({ name, label, icon: Icon, placeholder, unit }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2'>
                        <Icon className="text-primary" />
                        {label}
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input type="number" step="0.01" placeholder={placeholder} {...field} className="pr-14"/>
                        </FormControl>
                        {unit && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{unit}</span>}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </CardContent>
          <Separator className="my-4" />
          <CardFooter>
            <Button type="submit" disabled={isLoading} size="lg" className="w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow">
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles />
                  Get Recommendations
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
